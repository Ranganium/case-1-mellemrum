import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SUPABASE_URL, headers } from "../services/events";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);

  // Loading og fejlhåndtering
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setRegistrationCount(data.length);
      } catch (err) {
        console.error("Fejl ved indlæsning af tilfelinger:", err);
        setError(err.message || "Der opstod en uventet fejl");
      } finally {
        setIsLoading(false);
      }
    }

    getRegistrations();
  }, []);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1>Tilmeldinger</h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        <div className="registration-list">
          <div className="registration-row registration-labels">
            <span>Navn</span>
            <span>Event</span>
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
            (registrations.length === 0 ? (
              <p>Ingen tilmeldinger fundet.</p>
            ) : (
              registrations.map((registration) => (
                <div className="registration-row" key={registration.id}>
                  <div>
                    <strong>{registration.name}</strong>
                    <small>{registration.email}</small>
                  </div>
                  <span>{registration.eventTitle}</span>
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
