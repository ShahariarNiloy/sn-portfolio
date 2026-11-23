// Isometric line illustrations for the Capabilities bento on the home page.
// Computed at build time; the page ships plain SVG paths.

type P3 = [number, number, number];
type Proj = (x: number, y: number, z: number) => [number, number];
export interface Shape {
	d: string;
	c: string;
	dl?: string;
}
export interface Illustration {
	draw: Shape[];
	ghost: Shape[];
	float: Shape[];
}

const mk =
	(ox: number, oy: number): Proj =>
	(x, y, z) => [ox + (x - y) * 0.866, oy + (x + y) * 0.5 - z];
const f1 = (v: number) => v.toFixed(1);

function P2(pr: Proj, pts: P3[], open?: boolean) {
	return (
		'M' +
		pts
			.map((p) => {
				const q = pr(p[0], p[1], p[2]);
				return f1(q[0]) + ' ' + f1(q[1]);
			})
			.join(' L') +
		(open ? '' : ' Z')
	);
}
const L = (pr: Proj, pts: P3[], c: string): Shape => ({ d: P2(pr, pts, true), c });

function bx(pr: Proj, x: number, y: number, z: number, dx: number, dy: number, dz: number, cls = ''): Shape[] {
	const x1 = x + dx,
		y1 = y + dy,
		z1 = z + dz;
	return [
		{ d: P2(pr, [[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]]), c: 'f-side ' + cls },
		{ d: P2(pr, [[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]]), c: 'f-front ' + cls },
		{ d: P2(pr, [[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]]), c: 'f-top ' + cls },
	];
}
type Box = [number, number, number, number, number, number, string?];
function bxs(pr: Proj, list: Box[]) {
	let o: Shape[] = [];
	list
		.slice()
		.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[2] - b[2])
		.forEach((b) => {
			o = o.concat(bx(pr, b[0], b[1], b[2], b[3], b[4], b[5], b[6]));
		});
	return o;
}
function rXY(cx: number, cy: number, z: number, r: number): P3[] {
	const a: P3[] = [];
	for (let i = 0; i <= 48; i++) {
		const t = (i / 48) * Math.PI * 2;
		a.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r, z]);
	}
	return a;
}
function circ(pr: Proj, p: P3, r: number, c: string): Shape {
	const q = pr(p[0], p[1], p[2]);
	const a: string[] = [];
	for (let i = 0; i <= 24; i++) {
		const t = (i / 24) * Math.PI * 2;
		a.push(f1(q[0] + Math.cos(t) * r) + ' ' + f1(q[1] + Math.sin(t) * r));
	}
	return { d: 'M' + a.join(' L') + ' Z', c };
}
// dotted construction guides running out from a footprint along both iso axes
function guides(pr: Proj, x0: number, y0: number, x1: number, y1: number, len: number): Shape[] {
	return [
		L(pr, [[x0 - len, y0, 0], [x1 + len, y0, 0]], 'guide'),
		L(pr, [[x0 - len, y1, 0], [x1 + len, y1, 0]], 'guide'),
		L(pr, [[x0, y0 - len, 0], [x0, y1 + len, 0]], 'guide'),
		L(pr, [[x1, y0 - len, 0], [x1, y1 + len, 0]], 'guide'),
	];
}
function hull(pr: Proj, pts: P3[], c: string): Shape {
	const p = pts.map((q) => pr(q[0], q[1], q[2])).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
	const cr = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
	const lo: number[][] = [],
		up: number[][] = [];
	p.forEach((q) => {
		while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
		lo.push(q);
	});
	for (let i = p.length - 1; i >= 0; i--) {
		const q = p[i];
		while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
		up.push(q);
	}
	return {
		d:
			'M' +
			lo
				.slice(0, -1)
				.concat(up.slice(0, -1))
				.map((q) => f1(q[0]) + ' ' + f1(q[1]))
				.join(' L') +
			' Z',
		c,
	};
}
function star(pr: Proj, p: P3, r: number): Shape {
	const q = pr(p[0], p[1], p[2]),
		x = q[0],
		y = q[1],
		k = r * 0.25;
	return {
		d: `M${f1(x)} ${f1(y - r)} L${f1(x + k)} ${f1(y - k)} L${f1(x + r)} ${f1(y)} L${f1(x + k)} ${f1(y + k)} L${f1(x)} ${f1(y + r)} L${f1(x - k)} ${f1(y + k)} L${f1(x - r)} ${f1(y)} L${f1(x - k)} ${f1(y - k)} Z`,
		c: 'accl',
	};
}
function fin(draw: Shape[], ghost: Shape[] = [], flt: Shape[] = []): Illustration {
	let n = 0;
	const stamp = (p: Shape): Shape => {
		const o = { d: p.d, c: p.c, dl: (0.1 + n * 0.04).toFixed(2) + 's' };
		n++;
		return o;
	};
	return { draw: draw.map(stamp), ghost, float: flt.map(stamp) };
}

// 1. performance: heavy server stack -> one small chip
function perf() {
	const A = mk(150, 156),
		B = mk(382, 156);
	let pd: Shape[] = [],
		pg: Shape[] = [];
	pg = pg.concat(guides(A, -40, -30, 40, 30, 30));
	for (let k = 0; k < 4; k++) {
		const z = k * 19;
		pd = pd.concat(bx(A, -40, -30, z, 80, 60, 15));
		pd.push(L(A, [[-30, 30, z + 7.5], [6, 30, z + 7.5]], 'sl'));
		pd.push(circ(A, [16, 30, z + 7.5], 1.3, 'dotg'));
		pd.push(circ(A, [24, 30, z + 7.5], 1.3, 'dotg'));
	}
	pg = pg.concat(guides(B, -30, -30, 30, 30, 22));
	pd = pd.concat(bx(B, -30, -30, 0, 60, 60, 4));
	for (let pi = -18; pi <= 18; pi += 6) {
		pd.push(L(B, [[pi, -22, 4], [pi, -17, 4]], 'sl'));
		pd.push(L(B, [[pi, 17, 4], [pi, 22, 4]], 'sl'));
		pd.push(L(B, [[-22, pi, 4], [-17, pi, 4]], 'sl'));
		pd.push(L(B, [[17, pi, 4], [22, pi, 4]], 'sl'));
	}
	const pf = bx(B, -13, -13, 4, 26, 26, 6, 'acc').concat([circ(B, [0, 0, 10], 3, 'dotf')]);
	pg.push({ d: 'M220 112 L316 112', c: 'guide' });
	pd.push({ d: 'M309 108 L316 112 L309 116', c: 'sl2' });
	return fin(pd, pg, pf);
}

// 2. memory: a RAM stick in its socket, one chip flagged, heap budget gauge above
function mem() {
	const M = mk(160, 120);
	let md: Shape[] = [];
	const mf: Shape[] = [];
	const mg = guides(M, -78, -9, 78, 9, 18);
	md = md.concat(bx(M, -78, -9, 0, 156, 18, 8));
	md.push(L(M, [[-74, 0, 8], [74, 0, 8]], 'sl'));
	md = md.concat(bx(M, -70, -3, 8, 140, 6, 40));
	for (let cx = -66; cx <= 66; cx += 5) md.push(L(M, [[cx, 3, 9], [cx, 3, 14]], 'sl'));
	md.push(L(M, [[-4, 3, 8], [-4, 3, 13], [4, 3, 13], [4, 3, 8]], 'sl2'));
	for (let ck = 0; ck < 4; ck++) {
		const x0 = -60 + ck * 31;
		md.push({
			d: P2(M, [[x0, 3, 20], [x0 + 24, 3, 20], [x0 + 24, 3, 40], [x0, 3, 40]]),
			c: ck === 2 ? 'f-front acc' : 'f-front',
		});
		if (ck === 2) md.push(circ(M, [x0 + 5, 3, 35], 1.4, 'dotf'));
	}
	mf.push({ d: P2(M, [[-50, 3, 62], [50, 3, 62], [50, 3, 68], [-50, 3, 68]]), c: 'sl2' });
	mf.push({ d: P2(M, [[-50, 3, 62], [8, 3, 62], [8, 3, 68], [-50, 3, 68]]), c: 'accfill' });
	mf.push(L(M, [[30, 3, 57], [30, 3, 73]], 'sl2'));
	return fin(md, mg, mf);
}

// 3. zero-server: a browser window full of tools, the server crossed out
function zero() {
	const Z = mk(148, 108);
	let zd: Shape[] = [],
		zg: Shape[] = [];
	zg = zg.concat(guides(Z, -64, -46, 64, 46, 20));
	zd = zd.concat(bx(Z, -64, -46, 0, 128, 92, 5));
	zd.push(L(Z, [[-64, -32, 5], [64, -32, 5]], 'sl'));
	[-56, -50, -44].forEach((x) => zd.push(circ(Z, [x, -39, 5], 1.4, 'dotg')));
	zd.push(L(Z, [[-34, -39, 5], [40, -39, 5]], 'sl'));
	zd = zd.concat(
		bxs(Z, [
			[-46, -20, 5, 18, 18, 5],
			[-14, -20, 5, 18, 18, 5],
			[18, -20, 5, 18, 18, 5],
			[-46, 10, 5, 18, 18, 5],
			[18, 10, 5, 18, 18, 5],
		]),
	);
	const zf = bx(Z, -14, 10, 5, 18, 18, 5, 'acc').concat([circ(Z, [-5, 19, 10], 2.2, 'dotf')]);
	zg = zg.concat(bx(Z, 92, -78, 0, 28, 28, 62, 'ghost'));
	zg.push(L(Z, [[64, -40, 20], [92, -60, 20]], 'guide'));
	zd.push(L(Z, [[96, -50, 12], [116, -50, 50]], 'sl2'), L(Z, [[96, -50, 50], [116, -50, 12]], 'sl2'));
	return fin(zd, zg, zf);
}

// 4. award: a trophy with a blue rim
function award() {
	const D = mk(160, 152);
	let dd: Shape[] = [];
	const dg = guides(D, -26, -26, 26, 26, 14);
	dd = dd.concat(bx(D, -26, -26, 0, 52, 52, 8), bx(D, -16, -16, 8, 32, 32, 12));
	dd.push({ d: P2(D, [[-12, 26, 2], [12, 26, 2], [12, 26, 6], [-12, 26, 6]]), c: 'sl2' });
	dd.push(hull(D, rXY(0, 0, 20, 4).concat(rXY(0, 0, 40, 4)), 'body'));
	dd.push(hull(D, rXY(0, 0, 38, 9).concat(rXY(0, 0, 44, 9)), 'body'));
	const hl: P3[] = [],
		hr: P3[] = [];
	for (let hi = 0; hi <= 16; hi++) {
		const t = (hi / 16) * Math.PI;
		hl.push([-22 - Math.sin(t) * 12, -6, 54 + Math.cos(t) * 11]);
		hr.push([22 + Math.sin(t) * 12, 6, 54 + Math.cos(t) * 11]);
	}
	dd.push(L(D, hl, 'sl2'));
	dd.push(hull(D, rXY(0, 0, 44, 8).concat(rXY(0, 0, 76, 26)), 'body'));
	dd.push(L(D, hr, 'sl2'));
	dd.push({ d: P2(D, rXY(0, 0, 76, 26)), c: 'body' });
	dd.push({ d: P2(D, rXY(0, 0, 76, 21)), c: 'sl' });
	dd.push({ d: P2(D, rXY(0, 0, 76, 26)), c: 'accl' });
	const df = [star(D, [34, -34, 92], 6), star(D, [-30, 30, 100], 4)];
	return fin(dd, dg, df);
}

// 5. research: a handwritten glyph on paper, read by a floating scan frame
function research() {
	const R = mk(206, 124);
	let rd: Shape[] = [],
		rg: Shape[] = [];
	const rf: Shape[] = [];
	rg = rg.concat(guides(R, -74, -52, 70, 48, 16));
	rd = rd.concat(bx(R, -74, -52, 0, 140, 96, 3), bx(R, -70, -48, 3, 140, 96, 3));
	const glyph = ['..####..', '.#....#.', '......#.', '..####..', '.#....#.', '.#....##', '..####.#', '........'];
	const gx = -60,
		gy = -38,
		cs = 7;
	glyph.forEach((row, r) => {
		for (let c = 0; c < 8; c++) {
			if (row[c] === '#') {
				const x = gx + c * cs,
					y = gy + r * cs;
				rd.push({
					d: P2(R, [
						[x + 0.8, y + 0.8, 6],
						[x + cs - 0.8, y + 0.8, 6],
						[x + cs - 0.8, y + cs - 0.8, 6],
						[x + 0.8, y + cs - 0.8, 6],
					]),
					c: 'pix',
				});
			}
		}
	});
	rd.push({ d: P2(R, [[gx, gy, 6], [gx + 56, gy, 6], [gx + 56, gy + 56, 6], [gx, gy + 56, 6]]), c: 'sl' });
	[-34, -24, -14, -4, 6, 16].forEach((y, k) => rd.push(L(R, [[10, y, 6], [k % 3 === 2 ? 36 : 56, y, 6]], 'sl')));
	const fz = 34;
	const fr: [number, number][] = [
		[gx - 4, gy - 4],
		[gx + 60, gy - 4],
		[gx + 60, gy + 60],
		[gx - 4, gy + 60],
	];
	fr.forEach((p) => rg.push(L(R, [[p[0], p[1], 6], [p[0], p[1], fz]], 'guide')));
	rf.push({ d: P2(R, fr.map((p) => [p[0], p[1], fz] as P3)), c: 'accl' });
	fr.forEach((p, i) => {
		const sx = i === 0 || i === 3 ? 1 : -1,
			sy = i < 2 ? 1 : -1;
		rf.push(L(R, [[p[0] + sx * 10, p[1], fz], [p[0], p[1], fz], [p[0], p[1] + sy * 10, fz]], 'sl2'));
	});
	rf.push(circ(R, [gx + 60, gy - 4, fz], 2.4, 'dotf'));
	return fin(rd, rg, rf);
}

// 6. seo: a sitemap tree with one indexed path highlighted
function seo() {
	const T = mk(206, 106);
	let td: Shape[] = [];
	const tg = guides(T, -100, -80, 58, 72, 14);
	const mids = [-60, -12, 36];
	const leaves: Box[] = [];
	mids.forEach((y, k) => {
		const hot = k === 0;
		td.push(L(T, [[-76, 0, 3], [-55, 0, 3], [-55, y + 12, 3], [-30, y + 12, 3]], hot ? 'accl' : 'sl'));
		[-14, 14].forEach((dy, j) => {
			const ly = y + dy + 3;
			td.push(L(T, [[-6, y + 12, 3], [16, y + 12, 3], [16, ly + 9, 3], [40, ly + 9, 3]], hot && j === 0 ? 'accl' : 'sl'));
			if (!(hot && j === 0)) leaves.push([40, ly, 0, 18, 18, 4]);
		});
	});
	td = td.concat(
		bxs(T, ([[-100, -12, 0, 24, 24, 6]] as Box[]).concat(mids.map((y) => [-30, y, 0, 24, 24, 6] as Box)).concat(leaves)),
	);
	const tf = bx(T, 40, -71, 0, 18, 18, 4, 'acc').concat([
		{ d: P2(T, rXY(49, -62, 24, 9)), c: 'accl' },
		L(T, [[49, -62, 4], [49, -62, 15]], 'guide'),
	]);
	return fin(td, tg, tf);
}

export const ILL = {
	perf: perf(),
	mem: mem(),
	zero: zero(),
	award: award(),
	research: research(),
	seo: seo(),
};
