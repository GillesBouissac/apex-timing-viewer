<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<nav class="block bg-white border-gray-200 dark:bg-gray-900">
	<div class="flex justify-between mx-auto pl-4 pr-4 pt-2 pb-2">
		<div class="nav-card">
			<a href="/">
				Race analyser
			</a>
		</div>
		<ul class="flex justify-start font-medium p-0 my-0 rounded-lg space-x-8 rtl:space-x-reverse border-0 ">

			<li class="text-gray-900">
				<div class="nav-card">
					<a href={resolve('/timeline')} class="nav-link" class:disabled={page.url.pathname.toString() === resolve('/timeline')}>
						Timeline
					</a>
				</div>
			</li>

			<li class="text-gray-900">
				<div class="nav-card">
					<a href={resolve('/selector')} class="nav-link" class:disabled={page.url.pathname.toString() === resolve('/selector')}>
						Race
					</a>
				</div>
			</li>

		</ul>
	</div>
</nav>

<style>
	.disabled {
		pointer-events: none;
		cursor: default;
		opacity: 0.6;
  	}
</style>