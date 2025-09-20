<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	console.log(`From page.svelte: /timeline => ${resolve('/timeline')}`);

	goto(resolve('/timeline'));
</script>
