/// <reference path="../manual_typings/open.d.ts" />
'use strict';
import {resolve} from 'path';
import {Message} from './definitions/message';
import {Submission} from './definitions/submission';
import * as connectLivereload from 'connect-livereload';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as randomImages from './modules/random.images';
import * as mailHelper from './modules/mail.helper';
import * as nodeMailer from './modules/node.mailer';
import * as tinylrFn from 'tiny-lr';
import * as openResource from 'open';
import * as serveStatic from 'serve-static';
import {APP_BASE, APP_DEST, DOCS_DEST, LIVE_RELOAD_PORT, DOCS_PORT, PORT} from '../config';

let lastModified = require('./config/last.mod.props.json');
let errorConfig = require('./config/error.props.json');
let tinylr = tinylrFn();

let serveSPA = () => {
  let server = express();
  tinylr.listen(LIVE_RELOAD_PORT);

  server.use(compression());
  server.use(bodyParser.json());

  server.get('/imageids', (req, res) => {
    res.json({imageIds: randomImages.getIds()});
  });

  server.get('/lastmodified', (req, res) => {
    res.json(lastModified);
  });

  server.get('/errorconfig', (req, res) => {
    res.json(errorConfig);
  });

  /**
   * Validates user submission and sends the message received via the contact from
   *
   * @param {Object} submission
   * @param {string} submission.name
   * @param {string} submission.email
   * @param {string} submission.text
   * @param {string} submission.heuning
   */
  server.post('/send', (req, res) => {
    let submission:Submission = req.body,
      errors:Array<string> = mailHelper.validate(submission);

    if (errors.length > 0) {
      res.status(400).send({errors: errors});
    } else {

      let message:Message = mailHelper.buildMessage(submission),
        messageCopy:Message = mailHelper.buildMessageCopy(submission);

      nodeMailer.send(message, (success:boolean) => {
        if (success) {
          nodeMailer.send(messageCopy, (success:boolean) => {
            if (success) {
              res.status(200).json('Sent successfully');
            } else {
              res.sendStatus(500);
            }
          });
        } else {
          res.sendStatus(500);
        }
      });
    }
  });

  server.use(
    APP_BASE,
    connectLivereload({port: LIVE_RELOAD_PORT}),
    express.static(process.cwd())
  );

  server.listen(PORT, () =>
    openResource('http://localhost:' + PORT + APP_BASE + APP_DEST)
  );
};

let notifyLiveReload = (e) => {
  let fileName = e.path;
  tinylr.changed({
    body: {files: [fileName]}
  });
};

let serveDocs = () => {
  let server = express();

  server.use(
    APP_BASE,
    serveStatic(resolve(process.cwd(), DOCS_DEST))
  );

  server.listen(DOCS_PORT, () =>
    openResource('http://localhost:' + DOCS_PORT + APP_BASE)
  );
};

export {serveSPA, notifyLiveReload, serveDocs};
