import CreateEventForm from "../pages/admin/CreateEventFrom";


export default function CreateEvent() {
  return (
    <div className="manage">

    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
      <CreateEventForm/>
    </div>
    </div>
  );
}

