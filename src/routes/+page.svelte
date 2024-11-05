<!-- Archivo para Login -->
<script>
	import axios from 'axios';
	let userName = '';
	let password = '';
	let errorMessage = '';

	const validate = async () => {
		 try {
				const response = await axios.post('https://localhost:7048/api/authentication/login', {
					 userName,
					 password
				});
				if (response.status === 200) {
					 errorMessage = '';
					 const token = response.data.token; 
					 localStorage.setItem('authToken', token); 
					 window.location.href = '/bookings/';
				} else {
					 errorMessage = 'Login fallido. Revisa tus credenciales.';
				}
		 } catch (error) {
				errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
				console.error(error);
		 }
	};
</script>


<div class="container d-flex flex-column align-items-center justify-content-center vh-100">
	<h2>Booking Service</h2>
	<div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
		<div class="mb-3">
			<label for="userName" class="form-label">Username</label>
			<input type="text" id="userName" bind:value={userName} class="form-control" required />
		</div>
		<div class="mb-3">
			<label for="password" class="form-label">Password</label>
			<input type="password" id="password" bind:value={password} class="form-control" required />
		</div>
		{#if errorMessage}
			<div class="alert alert-danger mt-2" role="alert">
				{errorMessage}
			</div>
		{/if}
		<button class="btn btn-primary w-100" on:click={validate}>Sign In</button>
	</div>
</div>

<style>
	.container { font-family: Arial, sans-serif; }
	.card { border-radius: 10px; }
	h2 { margin-bottom: 20px; text-align: center; }
	.alert { font-size: 0.9rem; margin-top: 10px; }
	label{
		color: #000;
	}
</style>
