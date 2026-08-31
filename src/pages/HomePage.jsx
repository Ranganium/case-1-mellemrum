import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SUPABASE_URL, headers } from "../services/events";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getEvents() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${SUPABASE_URL}/events?order=date.asc`, {
          headers,
        });

        if (!response.ok) {
          throw new Error(`Kunne ikke hente events (Fejl: ${response.status})`);
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Fejl ved hentning af events:", err);
        setError(err.message || "Der opstod en uventet fejl");
      } finally {
        setIsLoading(false);
      }
    }

    getEvents();
  }, []);

  const categories = [
    "Alle",
    ...new Set(events.map((event) => event.category)),
  ];

  const filteredEvents = events.filter((event) => {
    const searchText =
      `${event.title} ${event.summary} ${event.venueName}`.toLowerCase();
    const matchesSearch = searchText.includes(search.toLowerCase());
    const matchesCategory = category === "Alle" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  function formatEventDate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toLocaleDateString("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return (
    <>
      <header className="hero">
        <p className="eyebrow">Kultur i Aarhus</p>
        <h1>Find plads til noget nyt.</h1>
        <p className="hero-copy">
          Koncerter, talks og workshops samlet ét sted. Find dit næste event, og
          tilmeld dig på få minutter.
        </p>
        <a className="hero-link" href="#events">
          Se kommende events ↓
        </a>
      </header>

      <main id="events">
        <section className="section-heading">
          <div>
            <p className="eyebrow dark">Det sker</p>
            <h2>Kommende events</h2>
          </div>
          <p>Kuraterede oplevelser i byen – fra små scener til store idéer.</p>
        </section>

        <section className="filters">
          <label>
            Søg
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Søg efter titel eller sted"
            />
          </label>
          <label>
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </section>

        {isLoading && (
          <p className="loading-text">Indlæser kommende events...</p>
        )}

        {error && (
          <p className="error-text" style={{ color: "red" }}>
            Fejl: {error}
          </p>
        )}

        {!isLoading && !error && (
          <section id="events-grid" className="event-grid">
            {filteredEvents.length === 0 ? (
              <p>Ingen events matcher din søgning.</p>
            ) : (
              filteredEvents.map((event) => (
                <article className="event-card" key={event.id}>
                  <Link to={`/events/${event.title.replaceAll(" ", "-")}`}>
                    <img src={event.image} alt="" />
                  </Link>
                  <div className="event-card-content">
                    <p className="event-category">{event.category}</p>
                    <Link
                      className="title-link"
                      to={`/events/${event.title.replaceAll(" ", "-")}`}
                    >
                      <h3>{event.title}</h3>
                    </Link>
                    <p>{event.summary}</p>
                    <div className="event-meta">
                      <span>{formatEventDate(event.date)}</span>
                      <span>{event.venueName}</span>
                    </div>
                    <Link
                      className="card-link"
                      to={`/events/${event.title.replaceAll(" ", "-")}`}
                    >
                      Læs mere
                    </Link>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </>
  );
}
