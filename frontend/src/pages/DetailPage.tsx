import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import type { RentalType } from "../models/RentalType";
import Layout from "../components/layout/Layout";

import { detailStyles as styles } from "../styles/detailPage.styles";

export default function DetailPage() {
  const { id } = useParams();

  const [rental, setRental] =
    useState<RentalType | null>(null);

  const [predictedPrice, setPredictedPrice] =
    useState<number | null>(null);

  const [isPredicting, setIsPredicting] =
    useState(false);

  useEffect(() => {
    async function fetchRental() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/rental?id=${id}`
        );
        const data = await res.json();
        setRental(data);
      } catch (err) {
        console.error(
          "Failed to fetch rental:",
          err
        );
      }
    }

    fetchRental();
  }, [id]);

  async function fetchPredictedPrice() {
    setIsPredicting(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/predict?id=${id}`
      );

      const data = await res.json();

      setPredictedPrice(data);
    } catch (err) {
      console.error(
        "Failed to fetch predicted price:",
        err
      );
    } finally {
      setIsPredicting(false);
    }
  }

  if (!rental) {
    return (
      <Layout>
        <div className="p-20 text-center font-bold animate-pulse uppercase tracking-[0.5em]">
          Loading_System_Data...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {rental.address}
            </h1>

            <p className={styles.subtitle}>
              {rental.city} //{" "}
              {rental.province}
            </p>
          </div>

          <div className={styles.idBox}>
            ID_{id}
          </div>
        </div>

        <div className={styles.grid}>
          
          {/* MAIN */}
          <div className={styles.main}>
            
            <div className={styles.specsGrid}>
              {[
                {
                  label: "Beds",
                  value: rental.beds,
                },
                {
                  label: "Baths",
                  value: rental.baths,
                },
                {
                  label: "Sq Ft",
                  value:
                    rental.squareFeet,
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className={
                    styles.specCard
                  }
                >
                  <p
                    className={
                      styles.specLabel
                    }
                  >
                    {spec.label}
                  </p>

                  <p
                    className={
                      styles.specValue
                    }
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h3
                className={
                  styles.sectionTitle
                }
              >
                Technical Parameters
              </h3>

              <div
                className={
                  styles.technicalGrid
                }
              >
                <div className={styles.row}>
                  <span>
                    Lease Term
                  </span>
                  <span>
                    {
                      rental.lease_term_months
                    }{" "}
                    Months
                  </span>
                </div>

                <div className={styles.row}>
                  <span>
                    Availability
                  </span>
                  <span>
                    {
                      rental.availability_days
                    }{" "}
                    Days
                  </span>
                </div>

                <div className={styles.row}>
                  <span>Cats</span>
                  <span
                    className={
                      rental.cats
                        ? styles.allowed
                        : ""
                    }
                  >
                    {rental.cats
                      ? "ALLOWED"
                      : "NONE"}
                  </span>
                </div>

                <div className={styles.row}>
                  <span>Dogs</span>
                  <span
                    className={
                      rental.dogs
                        ? styles.allowed
                        : ""
                    }
                  >
                    {rental.dogs
                      ? "ALLOWED"
                      : "NONE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIDE */}
          <div className={styles.side}>
            
            <div>
              <label className={styles.label}>
                Current Rent
              </label>

              <p className={styles.price}>
                ${rental.price}
              </p>

              <p className={styles.smallText}>
                Per Month / Fixed
              </p>
            </div>

            <div>
              <button
                onClick={
                  fetchPredictedPrice
                }
                disabled={isPredicting}
                className={styles.button(
                  isPredicting
                )}
              >
                {isPredicting
                  ? "Calculating..."
                  : "Predict Market Price"}
              </button>

              {predictedPrice !==
                null && (
                <div
                  className={
                    styles.predictionBox
                  }
                >
                  <label
                    className={
                      styles.predictionLabel
                    }
                  >
                    ML_Prediction_Output
                  </label>

                  <p className="text-[36px] font-bold tabular-nums">
                    ${predictedPrice}
                  </p>

                  <div
                    className={
                      styles.barBg
                    }
                  >
                    <div
                      className={
                        styles.barFill
                      }
                      style={{
                        width: `${Math.min(
                          (predictedPrice /
                            rental.price) *
                            50,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}