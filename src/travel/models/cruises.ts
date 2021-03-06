import {IPoint, Point} from '../definitions/point';
import {DKCPH, LIFOU, NCMEE, NCNOU, NOOSL, NOSVJ, NOTOS, NZAKL, VUVLI} from './ports';

const DKCPH_NOOSL_WAY_POINTS: Array<IPoint> = [
  new Point(55.706266, 12.604649),
  new Point(55.711200, 12.619300),
  new Point(55.719820, 12.644250),
  new Point(55.721339, 12.646483),
  new Point(56.060300, 12.646500),
  new Point(56.107600, 12.563100),
  new Point(56.162700, 12.495000),
  new Point(57.055200, 11.720600),
  new Point(58.057500, 11.125000),
  new Point(58.667000, 10.754200),
  new Point(59.432000, 10.561800),
  new Point(59.506200, 10.586400),
  new Point(59.574900, 10.637300),
  new Point(59.677200, 10.613000),
  new Point(59.687000, 10.602500),
  new Point(59.736100, 10.577700),
  new Point(59.748700, 10.574900),
  new Point(59.814300, 10.580900),
  new Point(59.826400, 10.590900),
  new Point(59.876300, 10.652400),
  new Point(59.894500, 10.690600),
  new Point(59.897500, 10.702700),
  new Point(59.898300, 10.715200),
  new Point(59.899700, 10.725100),
  new Point(59.900220, 10.735281),
  new Point(59.900305, 10.743001),
  new Point(59.900910, 10.744353),
  new Point(59.901782, 10.744763),
];
const NOSVJ_NOTOS_WAY_POINTS: Array<IPoint> = [
  new Point(68.229180, 14.568028),
  new Point(68.224267, 14.560729),
  new Point(68.223678, 14.560761),
  new Point(68.223567, 14.561094),
  new Point(68.184400, 14.673800),
  new Point(68.176100, 14.723100),
  new Point(68.176435, 14.741921),
  new Point(68.240900, 15.426700),
  new Point(68.247100, 15.471200),
  new Point(68.347300, 15.928300),
  new Point(68.360900, 15.964500),
  new Point(68.382400, 16.000600),
  new Point(68.455800, 16.093900),
  new Point(68.497300, 16.132900),
  new Point(68.533199, 16.196300),
  new Point(68.546421, 16.221536),
  new Point(68.550400, 16.248200),
  new Point(68.559800, 16.359100),
  new Point(68.553200, 16.474400),
  new Point(68.566300, 16.521500),
  new Point(68.580299, 16.537800),
  new Point(68.604600, 16.551500),
  new Point(68.632947, 16.584390),
  new Point(68.650300, 16.615800),
  new Point(68.906400, 16.966900),
  new Point(68.935000, 17.026400),
  new Point(69.016900, 17.289400),
  new Point(69.080600, 17.381100),
  new Point(69.087100, 17.400200),
  new Point(69.092200, 17.424200),
  new Point(69.173599, 17.983100),
  new Point(69.184500, 18.011300),
  new Point(69.192600, 18.024200),
  new Point(69.202200, 18.015600),
  new Point(69.221900, 17.952900),
  new Point(69.231600, 17.954300),
  new Point(69.245718, 17.974060),
  new Point(69.260600, 17.972600),
  new Point(69.297000, 17.973600),
  new Point(69.309299, 17.969500),
  new Point(69.351220, 18.092486),
  new Point(69.362089, 18.100254),
  new Point(69.380991, 18.082532),
  new Point(69.421219, 18.120404),
  new Point(69.467164, 18.099526),
  new Point(69.492608, 18.174298),
  new Point(69.510885, 18.307576),
  new Point(69.527000, 18.495500),
  new Point(69.553854, 18.701037),
  new Point(69.556879, 18.757045),
  new Point(69.567565, 18.802659),
  new Point(69.598800, 18.874400),
  new Point(69.636600, 18.950400),
];
const NZAKL_NCNOU_WAY_POINTS: Array<IPoint> = [
  new Point(-36.836672, 174.773138),
  new Point(-36.836800, 174.784000),
  new Point(-36.837700, 174.812000),
  new Point(-36.822500, 174.832000),
  new Point(-36.815000, 174.831000),
  new Point(-36.788500, 174.808000),
  new Point(-36.754100, 174.820700),
  new Point(-36.571500, 175.001700),
  new Point(-36.422800, 174.999000),
  new Point(-36.293100, 174.993000),
  new Point(-36.135700, 174.984300),
  new Point(-35.526200, 174.956700),
  new Point(-35.429143, 174.942059),
  new Point(-35.371600, 174.830000),
  new Point(-35.307100, 174.809000),
  new Point(-34.281300, 174.065000),
  new Point(-33.193400, 173.308000),
  new Point(-31.918900, 172.411000),
  new Point(-30.037500, 171.130000),
  new Point(-28.957100, 170.415000),
  new Point(-27.568900, 169.482000),
  new Point(-26.504400, 168.787000),
  new Point(-25.424400, 168.086000),
  new Point(-24.399700, 167.426000),
  new Point(-23.340900, 166.749000),
  new Point(-22.494700, 166.210000),
  new Point(-22.472800, 166.208000),
  new Point(-22.448200, 166.209000),
  new Point(-22.440000, 166.208000),
  new Point(-22.424100, 166.209000),
  new Point(-22.409600, 166.214000),
  new Point(-22.376300, 166.232000),
  new Point(-22.294995, 166.332880),
  new Point(-22.288959, 166.358801),
  new Point(-22.285465, 166.427122),
  new Point(-22.284512, 166.430384),
  new Point(-22.277681, 166.430727),
];
const NCNOU_LIFOU_WAY_POINTS: Array<IPoint> = [
  new Point(-22.276800, 166.431000),
  new Point(-22.282844, 166.429826),
  new Point(-22.285400, 166.423000),
  new Point(-22.298400, 166.421000),
  new Point(-22.327800, 166.441000),
  new Point(-22.376900, 166.610000),
  new Point(-22.395600, 166.761000),
  new Point(-22.390700, 166.826000),
  new Point(-22.402300, 166.892000),
  new Point(-22.397600, 166.931000),
  new Point(-22.381600, 166.952000),
  new Point(-22.328400, 167.061000),
  new Point(-22.185000, 167.134000),
  new Point(-21.181400, 167.447000),
  new Point(-21.072500, 167.483000),
  new Point(-21.053500, 167.479000),
  new Point(-20.984700, 167.433000),
  new Point(-20.967900, 167.418000),
  new Point(-20.930100, 167.370000),
  new Point(-20.918600, 167.341000),
  new Point(-20.911894, 167.321915),
  new Point(-20.907083, 167.296338),
];
const LIFOU_VUVLI_WAY_POINTS: Array<IPoint> = [
  new Point(-20.898672, 167.304604),
  new Point(-20.889218, 167.315473),
  new Point(-20.864586, 167.332090),
  new Point(-17.972300, 168.166000),
  new Point(-17.807800, 168.196000),
  new Point(-17.786800, 168.210000),
  new Point(-17.755100, 168.254000),
  new Point(-17.743700, 168.274000),
  new Point(-17.740800, 168.300000),
  new Point(-17.746100, 168.304000),
];
const VUVLI_NCMEE_WAY_POINTS: Array<IPoint> = [
  new Point(-17.746100, 168.304000),
  new Point(-17.740800, 168.300000),
  new Point(-17.743700, 168.274000),
  new Point(-17.755100, 168.254000),
  new Point(-17.786800, 168.210000),
  new Point(-17.807800, 168.196000),
  new Point(-17.972300, 168.166000),
  new Point(-20.100400, 167.814000),
  new Point(-21.116000, 167.672000),
  new Point(-21.356357, 167.677755),
  new Point(-21.522315, 167.758582),
  new Point(-21.539319, 167.800210),
  new Point(-21.542107, 167.820528),
];
const NCMEE_NZAKL_WAY_POINTS: Array<IPoint> = [
  new Point(-21.558535, 167.841583),
  new Point(-21.564914, 167.818569),
  new Point(-21.575111, 167.799964),
  new Point(-21.589130, 167.788494),
  new Point(-21.607433, 167.787109),
  new Point(-35.429143, 174.942059),
  new Point(-35.526200, 174.956700),
  new Point(-36.135700, 174.984300),
  new Point(-36.293100, 174.993000),
  new Point(-36.422800, 174.999000),
  new Point(-36.571500, 175.001700),
  new Point(-36.754100, 174.820700),
  new Point(-36.788500, 174.808000),
  new Point(-36.815000, 174.831000),
  new Point(-36.822500, 174.832000),
  new Point(-36.837700, 174.812000),
  new Point(-36.836800, 174.784000),
  new Point(-36.836672, 174.773138),
];

/**
 * Array of Cruises for the Contact section
 * @type {IPoint[][]}
 */
export const CRUISES: Array<Array<IPoint>> = [
  [DKCPH.loc, ...DKCPH_NOOSL_WAY_POINTS, NOOSL.loc],
  [NOSVJ.loc, ...NOSVJ_NOTOS_WAY_POINTS, NOTOS.loc],
  [NZAKL.loc, ...NZAKL_NCNOU_WAY_POINTS, NCNOU.loc],
  [NCNOU.loc, ...NCNOU_LIFOU_WAY_POINTS, LIFOU.loc],
  [LIFOU.loc, ...LIFOU_VUVLI_WAY_POINTS, VUVLI.loc],
  [VUVLI.loc, ...VUVLI_NCMEE_WAY_POINTS, NCMEE.loc],
  [NCMEE.loc, ...NCMEE_NZAKL_WAY_POINTS, NZAKL.loc],
];

/**
 * Array of Upcoming Cruises for the Contact section
 * @type {IPoint[][]}
 */
export const UPCOMING_CRUISES: Array<Array<IPoint>> = [
];
