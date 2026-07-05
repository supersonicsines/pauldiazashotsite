// Shared session-persistence store for the pseudo-OS shell. One JSON blob in
// sessionStorage holds window, section, sidenote, and scroll state so a
// language switch (or reload within the session) restores the same desktop.
// Writers patch only their own top-level keys; all access is same-thread.

export const PDOS_STATE_KEY = 'pdos-state-v1';
export const PDOS_WARM_KEY = 'pdos-warm';

export type PdosWindowState = {
	open: boolean;
	min: boolean;
	x?: number;
	y?: number;
	w?: number;
	h?: number;
};

export type PdosState = {
	windows?: Record<string, PdosWindowState>;
	zOrder?: string[];
	collapsibles?: Record<string, boolean>;
	sidenotes?: Record<string, boolean>;
	scrollY?: number;
};

export function readPdosState(): PdosState {
	try {
		const raw = sessionStorage.getItem(PDOS_STATE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === 'object' ? parsed : {};
	} catch {
		return {};
	}
}

export function updatePdosState(mutate: (state: PdosState) => PdosState): void {
	try {
		sessionStorage.setItem(PDOS_STATE_KEY, JSON.stringify(mutate(readPdosState())));
	} catch {
		// Storage unavailable (e.g. private mode): the OS simply forgets.
	}
}

// The flag is written at click time, before the navigation commits. If the
// user cancels the navigation, the stale flag must not warm-boot an unrelated
// later reload — hence the timestamp with a short freshness window.
const WARM_BOOT_TTL_MS = 30_000;

declare global {
	interface Window {
		__pdosWarm?: boolean;
	}
}

export function consumeWarmBoot(): boolean {
	// BaseLayout's inline head script consumes the flag before first paint
	// (so the cold-boot glyph can never flash on a warm switch) and leaves
	// the verdict on window. The storage path below is a fallback for
	// documents without that script; key and TTL are mirrored there.
	if (typeof window.__pdosWarm === 'boolean') return window.__pdosWarm;
	try {
		const raw = sessionStorage.getItem(PDOS_WARM_KEY);
		sessionStorage.removeItem(PDOS_WARM_KEY);
		if (raw === null) return false;
		const requestedAt = Number(raw);
		return Number.isFinite(requestedAt) && Date.now() - requestedAt < WARM_BOOT_TTL_MS;
	} catch {
		return false;
	}
}

export function requestWarmBoot(): void {
	try {
		sessionStorage.setItem(PDOS_WARM_KEY, String(Date.now()));
	} catch {
		// Cold boot on the other side; acceptable degradation.
	}
}
