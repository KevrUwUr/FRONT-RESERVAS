<script>
  import Table from "../../components/table.svelte";
  import { getBookings } from "../../services/bookings/bookings";
  import { getClients } from "../../services/clients/clients";
  import { getServices } from "../../services/services/services";

  const headers = ['Start Date', 'End Date', 'Client'];

  // Llamada a las funciones asincrónicas
  let bookings;
  let clients;
	let services;

  async function loadData() {
    try {
      bookings = await getBookings();
      clients = await getClients();
			services = await getServices();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  loadData(); // Llamar a la función para cargar datos
</script>

<h1 class="text-center m-2">Bookings</h1>

{#await bookings}
  <div class="text-center">Cargando reservas...</div>
{:then booking}
  {#await clients}
    <div class="text-center">Cargando clientes...</div>
  {:then client}
    <div class="container">
      <Table headers={headers} data={booking} clients={client} services={services}/>
    </div>
  {:catch error}
    <div class="alert alert-danger" role="alert">
      Error al cargar clientes: {error.message}
    </div>
  {/await}
{:catch error}
  <div class="alert alert-danger" role="alert">
    Error al cargar reservas: {error.message}
  </div>
{/await}
