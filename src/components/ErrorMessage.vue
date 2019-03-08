<template>
	<div class="error-message">{{message}}</div>
</template>

<script>
	export default {
		name: 'error-message',
		props: ['message']
	}
</script>


<style lang="sass">
	@keyframes fadeIn
		from
			opacity: 0
		to 
			opacity: 1
	.error-message
		padding: 20px
		color: #DC143C
		text-align: center
		font-size: 25px
		border: 1px solid #DC143C
		border-radius: 5px
		margin: 20px 0
		animation: fadeIn .4s ease-in
</style>