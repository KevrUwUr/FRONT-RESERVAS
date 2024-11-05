<script>
	import {
		getBookings,
		createBooking,
		updateBooking,
		deleteBooking
	} from '../services/bookings/bookings';
	export let headers = [];
	export let data = [];
	export let clients = [];
	export let services = [];
	let selectedServices = [];
	let editData = { startDate: '', endDate: '', clientId: '', bookingServices: [] };
	let isModalOpen = false;
	let isModalEditOpen = false;
	let isModalCreateOpen = false;

	// Variables de filtro
	let filterStartDate = '';
	let filterEndDate = '';
	let filterClient = '';
	let filterService = '';

	// Función para aplicar los filtros
	$: filteredData = data.filter((booking) => {
		const matchesDateRange =
			(!filterStartDate || new Date(booking.startDate) >= new Date(filterStartDate)) &&
			(!filterEndDate || new Date(booking.endDate) <= new Date(filterEndDate));
		const matchesClient = !filterClient || booking.clientId === filterClient;
		const matchesService =
			!filterService || booking.services.some((service) => service.serviceId === filterService);
		return matchesDateRange && matchesClient && matchesService;
	});

	function openModal(services) {
		selectedServices = services;
		isModalOpen = true;
		editData = { startDate: '', endDate: '', clientId: '', bookingServices: [] };
	}

	function openModalEdit(booking) {
		isModalEditOpen = true;
		editData = {
			...booking,
			startDate: new Date(booking.startDate).toISOString().split('T')[0],
			endDate: new Date(booking.endDate).toISOString().split('T')[0],
			bookingServices: booking.services || []
		};
		console.log(editData);
	}

	function openCreateModal() {
		isModalCreateOpen = true;
		editData = { startDate: '', endDate: '', clientId: '', bookingServices: [] };
		console.log('Abrir modal');
	}

	function closeCreateModal() {
		isModalCreateOpen = false;
		editData = { startDate: '', endDate: '', clientId: '', bookingServices: [] };
	}

	function closeModalEdit() {
		isModalEditOpen = false;
		editData = { startDate: '', endDate: '', clientId: '', bookingServices: [] };
	}

	function closeModal() {
		isModalOpen = false;
		selectedServices = [];
	}

	function handleKeyDown(event) {
		if (event.key === 'Escape') {
			closeModal();
			closeModalEdit();
		}
	}

	async function submitEditForm() {
		const bookingData = {
			startDate: editData.startDate,
			endDate: editData.endDate,
			clientId: editData.clientId,
			bookingServices: editData.bookingServices.map((service) => ({ serviceId: service.serviceId }))
		};
		console.log(bookingData);

		await updateBooking(editData.bookingId, bookingData);
		data = await getBookings();
		closeModalEdit();
	}

	async function submitCreateForm() {
		const bookingData = {
			startDate: editData.startDate,
			endDate: editData.endDate,
			clientId: editData.clientId,
			bookingServices: selectedServices.map((service) => ({ serviceId: service.serviceId }))
		};

		await createBooking(bookingData);
		data = await getBookings();
		closeCreateModal();
	}

	async function confirmDeleteBooking(bookingId) {
		const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta reserva?');
		if (confirmDelete) {
			await deleteBooking(bookingId);
			data = await getBookings();
		}
	}
</script>

<div class="filters d-flex row">
	<div class="col">
		<label>Fecha de Inicio:</label>
		<input type="date" bind:value={filterStartDate} class="form-control" />
	</div>
	<div class="col">
		<label>Fecha de Fin:</label>
		<input type="date" bind:value={filterEndDate} class="form-control" />
	</div>
	<div class="col">
		<label>Cliente:</label>
		<select bind:value={filterClient} class="form-control">
			<option value="">Todos</option>
			{#each clients as client}
				<option value={client.clientId}>{client.name}</option>
			{/each}
		</select>
	</div>
	<div class="col">
		<label>Servicio:</label>
		<select bind:value={filterService} class="form-control">
			<option value="">Todos</option>
			{#each services as service}
				<option value={service.serviceId}>{service.name}</option>
			{/each}
		</select>
	</div>
</div>

<div class="table-responsive mt-2">
	<button class="btn btn-primary btn-sm w-100 mb-2" on:click={openCreateModal}> Nueva Reserva </button>
	{#if headers.length > 0 && filteredData.length > 0}
		<table class="table table-striped table-bordered shadow">
			<thead class="table-primary">
				<tr>
					{#each headers as header}
						<th class="text-center py-2">{header}</th>
					{/each}
					<th class="text-center">Acciones</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredData as register}
					<tr>
						<td class="text-center">{new Date(register.startDate).toLocaleDateString()}</td>
						<td class="text-center">{new Date(register.endDate).toLocaleDateString()}</td>
						<td class="text-center">{register.clientName}</td>
						<td class="text-center">
							<button
								class="btn btn-primary btn-sm"
								on:click={() => openModal(register.services)}
								aria-label="Ver Más">Ver Más</button
							>
							<button
								class="btn btn-primary btn-sm"
								on:click={() => openModalEdit(register)}
								aria-label="Editar">Editar</button
							>
							<button
								class="btn btn-primary btn-sm"
								on:click={() => confirmDeleteBooking(register.bookingId)}
								aria-label="Eliminar">Eliminar</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="text-center text-muted">Fetching data...</p>
	{/if}
</div>

<!-- Modal de Servicios -->
{#if isModalOpen}
	<div
		class={`modal fade show`}
		tabindex="-1"
		style="display: block;"
		role="dialog"
		on:click={closeModal}
		on:keydown={handleKeyDown}
	>
		<div class="modal-dialog" role="document" on:click|stopPropagation>
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Servicios de Reserva</h5>
					<button type="button" class="close" on:click={closeModal} aria-label="Cerrar">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					{#if selectedServices.length > 0}
						<ul class="list-group list-group-flush">
							{#each selectedServices as service}
								<li class="list-group-item">{service.name}</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted">No hay servicios disponibles para esta reserva.</p>
					{/if}
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" on:click={closeModal}>Cerrar</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal de Edición -->
{#if isModalEditOpen}
	<div
		class={`modal fade show`}
		tabindex="-1"
		style="display: block;"
		role="dialog"
		on:click={closeModal}
		on:keydown={handleKeyDown}
	>
		<div class="modal-dialog modal-lg" role="document" on:click|stopPropagation>
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Editar Reserva</h5>
					<button type="button" class="close" on:click={closeModalEdit} aria-label="Cerrar">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<form on:submit|preventDefault={submitEditForm}>
						<div class="form-group">
							<label for="startDate">Fecha de Inicio</label>
							<input
								type="date"
								id="startDate"
								bind:value={editData.startDate}
								class="form-control"
								required
							/>
						</div>
						<div class="form-group">
							<label for="endDate">Fecha de Fin</label>
							<input
								type="date"
								id="endDate"
								bind:value={editData.endDate}
								class="form-control"
								required
							/>
						</div>
						<div class="form-group">
							<label for="clientId">Seleccionar Cliente</label>
							<select id="clientId" bind:value={editData.clientId} class="form-control" required>
								<option value="">Seleccione un cliente</option>
								{#each clients as client}
									<option value={client.clientId}>{client.name}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="services">Seleccionar Servicios</label>
							<select
								id="services"
								multiple
								class="form-control"
								on:change={(e) => {
									const selectedOptions = Array.from(e.target.selectedOptions);
									editData.bookingServices = selectedOptions.map((option) => ({
										serviceId: option.value
									}));
								}}
							>
								{#each services as service}
									<option
										value={service.serviceId}
										selected={editData.bookingServices.some(
											(s) => s.serviceId === service.serviceId
										)}
									>
										{service.name}
									</option>
								{/each}
							</select>
						</div>

						<button type="submit" class="btn btn-primary">Guardar Cambios</button>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" on:click={closeModalEdit}>Cerrar</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Modal para Crear Reserva -->
{#if isModalCreateOpen}
	<div
		class={`modal fade show`}
		tabindex="-1"
		style="display: block;"
		role="dialog"
		on:click={closeCreateModal}
		on:keydown={handleKeyDown}
	>
		<div class="modal-dialog modal-lg" role="document" on:click|stopPropagation>
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Crear Reserva</h5>
					<button type="button" class="close" on:click={closeCreateModal} aria-label="Cerrar">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<form on:submit|preventDefault={submitCreateForm}>
						<div class="form-group">
							<label for="startDate">Fecha de Inicio</label>
							<input
								type="date"
								id="startDate"
								bind:value={editData.startDate}
								class="form-control"
								required
							/>
						</div>
						<div class="form-group">
							<label for="endDate">Fecha de Fin</label>
							<input
								type="date"
								id="endDate"
								bind:value={editData.endDate}
								class="form-control"
								required
							/>
						</div>
						<div class="form-group">
							<label for="clientId">Seleccionar Cliente</label>
							<select id="clientId" bind:value={editData.clientId} class="form-control" required>
								<option value="">Seleccione un cliente</option>
								{#each clients as client}
									<option value={client.clientId}>{client.name}</option>
								{/each}
							</select>
						</div>
						<div class="form-group">
							<label for="services">Seleccionar Servicios</label>
							<select
								id="services"
								multiple
								class="form-control"
								on:change={(e) => {
									const selectedOptions = Array.from(e.target.selectedOptions);
									selectedServices = selectedOptions.map((option) => ({ serviceId: option.value }));
								}}
							>
								{#each services as service}
									<option value={service.serviceId}>
										{service.name}
									</option>
								{/each}
							</select>
						</div>

						<button type="submit" class="btn btn-primary">Crear Reserva</button>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" on:click={closeModal}>Cerrar</button>
				</div>
			</div>
		</div>
	</div>
{/if}
