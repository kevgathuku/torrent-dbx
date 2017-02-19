import utils from './utils';

let validMagnet = 'magnet:?xt=urn:btih:565DB305A27FFB321FCC7B064AFD7BD73AEDDA2B&dn=bbb_sunflower_1080p_60fps_normal.mp4&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.publicbt.com%3a80%2fannounce&ws=http%3a%2f%2fdistribution.bbb3d.renderfarming.net%2fvideo%2fmp4%2fbbb_sunflower_1080p_60fps_normal.mp4';

it('returns true for valid magnet URIs', () => {
  expect(utils.isValidMagnetURI(validMagnet)).toBeTruthy();
});

it('returns false for invalid magnet URIs', () => {
  expect(utils.isValidMagnetURI('@#$#%$^&^&ER')).toBeFalsy();
});
