/** Fill every [data-dhaka-time] element with the current time in Dhaka, updating each second. */
export function startDhakaClock() {
	const els = document.querySelectorAll<HTMLElement>('[data-dhaka-time]');
	if (!els.length) return;
	const fmt = () => {
		try {
			return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' });
		} catch {
			return '--:--';
		}
	};
	const tick = () => {
		const t = fmt();
		els.forEach((el) => {
			if (el.textContent !== t) el.textContent = t;
		});
	};
	tick();
	setInterval(tick, 1000);
}
