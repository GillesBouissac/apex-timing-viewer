import { page } from '@vitest/browser/context';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/timeline/+page.svelte', () => {
	it('should render document', async () => {
		render(Page);

		const doc = page.getByRole('document');
		await expect.element(doc).toBeInTheDocument();
	});
});
