'use strict';
import {Component, OnInit} from '@angular/core';
import {HeaderService} from '../services/header';
import {MENU_CONFIG, GRID_ROTATOR_CONFIG} from '../models/header.config';
import {ImageIds} from '../definitions/image.ids';
import {delay} from '../../shared/common/delay';

@Component({
  selector: 'header',
  styleUrls: [
    './header/components/header.css',
  ],
  templateUrl: './header/components/header.html',
})
export class HeaderComponent implements OnInit {
  public imageIds: Array<string>;
  private _headerService: HeaderService;
  private _previousWidth: number;
  private _previousHeight: number;

  constructor(_headerService: HeaderService) {
    this._headerService = _headerService;
  }

  ngOnInit() {
    this.initImageIds();
    this.initResizeListener();
  }

  initImageIds() {
    this._headerService.getImageIds().subscribe(
      resp => this.initGridRotator((<ImageIds>resp).imageIds),
      err => console.warn('imageIds not returned')
    );
  }

  initResizeListener() {
    (($: JQueryStatic) => {
      $(window).on('resize', () => {
        this.setBannerSize(this._previousWidth, this._previousHeight);
      });
    })(jQuery);
  }

  initGridRotator(imageIds: Array<string>) {
    this.imageIds = imageIds;
    (($) => {
      // Delay 250ms for images to be rendered in template
      delay(250)
        .then(() => {
          this.setBannerSize(this._previousWidth, this._previousHeight);
          $('#ri-grid').gridrotator(GRID_ROTATOR_CONFIG);
          this.initNavigation();
        });
    })(jQuery);
  }

  initNavigation() {
    (($) => {
      $(document).ready(() => {
        $('.navbar-wrapper').stickUp(MENU_CONFIG);

        $('.navbar.navbar-inverse.navbar-static-top a').click(
          () =>
            $('.navbar-collapse').addClass('hide-class').addClass('collapse').removeClass('in')
        );

        $('.navbar-toggle').click(
          () =>
            $('.navbar-collapse').removeClass('hide-class')
        );
      });
    })(jQuery);
  }

  setBannerSize(previousWidth: number = 0, previousHeight: number = 0) {
    (($: JQueryStatic, previousWidth: number, previousHeight: number) => {
      let windowWidth: number = $(window).width(),
        windowHeight: number = $(window).height(),
        widthChanged: boolean = previousWidth !== windowWidth,
        heightChanged: boolean = false;
      // mobile browsers ads about 60px to screen height when hiding address bar - ignore this
      if (windowHeight - previousHeight > 60) {
        heightChanged = true;
      }
      if (windowHeight - previousHeight < -60) {
        heightChanged = true;
      }
      if (widthChanged || heightChanged) {
        $('.banner').css({
          'width': windowWidth,
          'height': windowHeight - 60,
        });
        this.setDynamicCssValues();
        this._previousWidth = windowWidth;
        this._previousHeight = windowHeight;
      }
    })(jQuery, previousWidth, previousHeight);
  }

  setDynamicCssValues() {
    (($: JQueryStatic) => {
      let bannerText: JQuery = $('.banner-text');
      bannerText.css('top', ((($(window).height() - bannerText.height()) / 2) - 63));
    })(jQuery);
  }
}
