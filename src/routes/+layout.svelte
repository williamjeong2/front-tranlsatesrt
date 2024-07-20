<script>
	import '../app.css';
</script>

<nav>
	<div class="nav-container">
		<a href="/" class="nav-logo" title="Back to Homapage">Home</a>
		<div class="nav-links">
			<a href="/about" class="link">About</a>
		</div>
	</div>
</nav>

<div class="container">
	<!-- 페이지는 아래에 삽입됩니다. -->
	<slot></slot>
</div>

<style>
	.container {
		max-width: 1400px;
		margin: 50px auto;
	}
</style>
