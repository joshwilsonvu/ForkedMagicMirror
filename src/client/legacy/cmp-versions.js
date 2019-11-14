/* cmpVersions(a,b)
	 * Compare two semantic version numbers and return the difference.
	 *
	 * argument a string - Version number a.
	 * argument a string - Version number b.
	 */
function cmpVersions(a, b) {
  const regExStrip0 = /(\.0+)+$/;
  const segmentsA = a.replace(regExStrip0, "").split(".");
  const segmentsB = b.replace(regExStrip0, "").split(".");
  const l = Math.min(segmentsA.length, segmentsB.length);

  for (let i = 0; i < l; i++) {
	const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
	if (diff) {
	  return diff;
	}
  }
  return segmentsA.length - segmentsB.length;
}

export default cmpVersions;