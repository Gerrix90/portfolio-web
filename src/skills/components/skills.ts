import {Component, OnInit} from '@angular/core';
import {SkillService} from '../services/skills';
import {Skill} from '../definitions/skill';
import {cancelableDelay} from '../../shared/common/delay';
import {elementInViewport} from '../../shared/common/element.in.viewport';

@Component({
  selector: 'skills',
  styleUrls: [
    './skills.css',
  ],
  templateUrl: 'skills.htm',
})
export class SkillsComponent implements OnInit {
  public skills: Array<Skill>;
  private _timeoutScroll: any;
  private _skillChartDrawn: boolean;

  constructor() {
    this._skillChartDrawn = false;
  }

  ngOnInit() {
    this.getSkills();
    this.initScrollListener();
  }

  getSkills() {
    SkillService.getSkills().then(
      (skills) => {
        this.skills = skills;
        this.drawChart();
      },
    );
  }

  initScrollListener() {
    (($: JQueryStatic) => {
      $(document).on('scroll', () => {
        // wait half a second for scroll to stop
        if (this._timeoutScroll) {
          clearTimeout(this._timeoutScroll);
        }
        this._timeoutScroll = cancelableDelay(500, () => {
          if (!this._skillChartDrawn) {
            this.drawChart();
          }
        });
      });
    })(jQuery);

    if (!this._skillChartDrawn) {
      this.drawChart();
    }
  }

  drawChart() {
    (($) => {
      $('.js_trigger_skills').each((index: number, val: Element) => {
        if (!this._skillChartDrawn && elementInViewport($, $(val))) {
          this._skillChartDrawn = true;
          $('.chart').easyPieChart({
            onStep: function (from: number, to: number, percent: number) { // tslint:disable-line
              $(this.el).find('.percent').text(Math.round(percent));
            },
          });
        }
      });
    })(jQuery);
  }
}
