import {Component, OnInit} from '@angular/core';
import {SkillService} from '../services/skills';
import {Skill} from '../definitions/skill';
import {cancelableDelay} from '../../shared/common/delay';
import {elementInViewport} from '../../shared/common/element.in.viewport';

@Component({
  selector: 'skills',
  styleUrls: ['./skills.css'],
  templateUrl: 'skills.htm',
})
export class SkillsComponent implements OnInit {
  public skills: Array<Skill>;
  private _timeoutScroll: any;
  private _skillChartDrawn: boolean;

  constructor() {
    this._skillChartDrawn = false;
  }

  ngOnInit(): void {
    this.getSkills();
    this.initScrollListener();
  }

  getSkills(): void {
    SkillService.getSkills().then(
      (skills) => {
        this.skills = skills;
        this.drawChart();
      },
    );
  }

  initScrollListener(): void {
    (($: JQueryStatic) => {
      $(document).on('scroll', () => {
        // wait half a second for scroll to stop
        if (this._timeoutScroll) {
          clearTimeout(this._timeoutScroll);
        }
        this._timeoutScroll = cancelableDelay(250, () => {
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

  drawChart(): void {
    (($) => {
      $('.js_trigger_skills').each((index: number, triggerEl: Element) => {
        if (!this._skillChartDrawn && elementInViewport($, <JQuery>$(triggerEl))) {
          this._skillChartDrawn = true;
          $('.chart').each((index: number, chartEl: Element) => {
            (<any>$(chartEl)).easyPieChart({
              onStep: (from: number, to: number, percent: number) => {
                $(chartEl).find('.percent').text(Math.round(percent));
              },
            });
          });
        }
      });
    })(jQuery);
  }
}
