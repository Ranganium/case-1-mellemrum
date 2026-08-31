import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SUPABASE_URL, headers } from "../services/events";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);

  // To e-mail states: én til det man skriver i feltet, og én til den der rent faktisk søges på
  const [inputEmail, setInputEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  // Loading og fejlhåndtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hent alle tilmeldinger én gang når siden loades
  useEffect(() => {
    async function getRegistrations() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${SUPABASE_URL}/registrations?order=createdAt.desc`,
          { headers },
        );

        if (!response.ok) {
          throw new Error(
            `Kunne ikke indlæse tilmeldinger (Fejl: ${response.status})`,
          );
        }

        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        console.error("Fejl ved indlæsning:", err);
        setError(err.message || "Der opstod en uventet fejl");
      } finally {
        setIsLoading(false);
      }
    }

    getRegistrations();
  }, []);

  // Denne funktion kører KUN når man trykker på knappen (eller trykker Enter i formen)
  function handleSearch(e) {
    e.preventDefault();
    setSearchedEmail(inputEmail); // Først her flyttes det skrevne over til vores søge-state
  }

  // Vi filtrerer kun baseret på den "låste" searchedEmail, ikke det man sidder og taster
  const filteredRegistrations = registrations.filter((reg) => {
    return reg.email.toLowerCase().includes(searchedEmail.toLowerCase());
  });

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Dit personlige overblik</p>
        <h1>
          {(() => {
            const name = filteredRegistrations[0]?.name;
            if (!name) return "Dine tilmeldinger";

            // Tjek om det sidste bogstav er s, z eller x (uanset store/små bogstaver)
            const endsWithSZX = ["s", "z", "x"].includes(
              name.slice(-1).toLowerCase(),
            );

            // Brug enten kun apostrof eller 's
            return `${name}${endsWithSZX ? "'" : "s"} tilmeldinger`;
          })()}
        </h1>
        <p>
          {searchedEmail === ""
            ? "0 tilmeldinger i alt"
            : `${filteredRegistrations.length} tilmeldinger fundet`}
        </p>
      </header>
      <main style={{ display: "flex", flexDirection: "column", gap: `3rem` }}>
        <section className="email-search-panel">
          <form onSubmit={handleSearch} className="search-form">
            <label>
              Indtast din e-mail for at se dine tilmeldinger
              <input
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="dig@example.com"
              />
            </label>
            <button type="submit">Vis tilmeldinger</button>
          </form>
        </section>

        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Event</span>
            <span>Sted</span>
            <span>Dato</span>
            <span>Status</span>
          </div>

          {isLoading && (
            <p className="loading-text">Indlæser tilmeldinger...</p>
          )}

          {error && (
            <p className="error-text" style={{ color: "red" }}>
              Fejl: {error}
            </p>
          )}

          {!isLoading &&
            !error &&
            (searchedEmail === "" ? (
              <p style={{ position: "relative", left: `1vw` }}>
                Du skal angive din email og trykke på knappen for at se dine
                tilmeldinger
              </p>
            ) : filteredRegistrations.length === 0 ? (
              <p>Ingen tilmeldinger fundet for denne e-mail.</p>
            ) : (
              filteredRegistrations.map((registration) => (
                <div className="registration-row" key={registration.id}>
                  <span>{registration.eventTitle}</span>
                  <span>{registration.eventLocation}</span>
                  <span>
                    {new Date(registration.eventDate).toLocaleDateString(
                      "da-DK",
                    )}
                  </span>
                  <span className="status">{registration.status}</span>
                </div>
              ))
            ))}
        </div>
      </main>
    </>
  );
}
