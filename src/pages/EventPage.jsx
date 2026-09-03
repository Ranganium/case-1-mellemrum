import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { SUPABASE_URL, headers } from "../services/events";

export default function EventPage() {
  const { eventTitle } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // fejlhåndtering og loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Loading/ error function
  useEffect(() => {
    async function getEvent() {
      try {
        setIsLoading(true);
        setError(null);

        const title = eventTitle.replaceAll("-", " ");
        const response = await fetch(
          `${SUPABASE_URL}/events?title=eq.${encodeURIComponent(title)}&select=*,venue:venues(*)`,
          { headers },
        );

        if (!response.ok) {
          throw new Error(
            `Kunne ikke indlæse event (Fejl: ${response.status})`,
          );
        }
        const data = await response.json();
        setEvent(data[0]);
      } catch (err) {
        console.error("Fejl ved indlæsning af event:", err);
        setError(err.message || "Der opstod en uventet fejl");
      } finally {
        setIsLoading(false);
      }
    }

    getEvent();
  }, [eventTitle]);

  // Synlig loading
  if (isLoading) {
    return <p>Indlæser events...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Fejl: {error}</p>;
  }

  // Tilmeldingsblanket med funktion
  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    console.log({ name, email, event: event.title });

    const newRegistration = {
      name: name,
      email: email,
      eventId: event.id,
    };

    try {
      const response = await fetch(
        `${SUPABASE_URL}/registrations?select=*,event:events(*)`,
        {
          method: "POST",
          headers: {
            ...headers,
            Prefer: "return=representation",
          },
          body: JSON.stringify(newRegistration),
        },
      );

      if (!response.ok) {
        throw new Error("Kunne ikke gemme tilmeldingen");
      }

      alert("Tak for din tilmelding! Den er nu gemt.");
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Fejl ved indsendelse:", err);
      alert("Der opstod en fejl. Prøv igen.");
    }
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={event.image} alt="" />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                kl.{" "}
                {date.toLocaleTimeString("da-DK", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venueName}
                  <br />
                  {event.venueAddress}, {event.venuePostalCode}{" "}
                  {event.venueCity}
                  {event.venueWebsite && (
                    <>
                      <br />
                      <a href={event.venueWebsite}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>
              Udfyld formularen, så sender vi din tilmelding til arrangøren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Navn
              <input
                value={name}
                onChange={(inputEvent) => setName(inputEvent.target.value)}
                placeholder="Jens Jensen"
                required
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}
                placeholder="dig@example.com"
                required
              />
            </label>
            <button type="submit">Tilmeld mig</button>
          </form>
        </section>
      </main>
    </>
  );
}
