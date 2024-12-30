import React, { useEffect, useState } from 'react'
import NavBar from '../components/navBar'
import { db } from '../firebase-config';
import { addDoc, collection, getDocs, orderBy, query, doc, updateDoc, where, limit } from 'firebase/firestore'
import { Button } from 'react-bootstrap';

const Tool = () => {

    const [allRecords, setAllRecords] = useState([]);
    const [latestRecord, setLatestRecord] = useState(null);
    const [loading, setLoading] = useState(false)
    const [isToday, setIsToday] = useState(false);
    const [days, setDays] = useState(null);

    const mealsCollection = collection(db, "meals", "rRvWdcT1JTTaHabbKCL6", "tool")

    const getRecords = async () => {
        const q = await query(mealsCollection, orderBy('date', 'desc'));
        const data = await getDocs(q);

        const records = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));

        setAllRecords(records);

        // Set the most recent record as the latest record
        if (records.length > 0) {
            const latest = records[0];
            setLatestRecord(latest);

            // Calculate the number of days since the latest record
            const today = new Date();
            const latestDate = latest.date?.toDate();
            if (latestDate) {
                const diffTime = Math.abs(today - latestDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDays(diffDays);

                // Check if the latest record is from today
                if (
                    latestDate.getFullYear() === today.getFullYear() &&
                    latestDate.getMonth() === today.getMonth() &&
                    latestDate.getDate() === today.getDate()
                ) {
                    setIsToday(true);
                } else {
                    setIsToday(false);
                }
            }
        } else {
            setDays(null);
        }
    };

    useEffect(() => {
        getRecords()
    }, [])

    const submitRecord = async () => {

        setLoading(true)
        // Update the latest record with the days calculated in the state
        if (latestRecord) {
            const latestRecordRef = doc(db, "meals", "rRvWdcT1JTTaHabbKCL6", "tool", latestRecord.id);
            await updateDoc(latestRecordRef, { duration: days });
        }

        // Add the new record
        const date = new Date();

        await addDoc(mealsCollection, {
            date,
        });

        console.log("Data inserted successfully");
        getRecords();
        setLoading(false)
    };


    return (
        <div style={{ maxWidth: "450px", margin: "auto" }}>
            <div style={{ backgroundColor: "#D3EEDF", width: "90%", borderRadius: "20px", textAlign: "center", padding: "20px", margin: "30px auto 0" }}>
                <div><h4>Last Record</h4></div>
                {latestRecord ? (
                    <>
                        <div>{latestRecord.date?.toDate().toLocaleDateString('en-KE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</div>
                        <div>{latestRecord.date?.toDate().toLocaleTimeString('en-KE', {
                            timeZone: 'Africa/Nairobi',
                        })}</div>

                        <div>
                            {days || 0} Day(s) Ago
                        </div>

                    </>
                ) : (
                    <div>No records available</div>
                )}
            </div>

            <div style={{ textAlign: "center", margin: "30px auto 0" }}>
                <Button onClick={submitRecord} className='text-white' style={{ backgroundColor: "#51AF61", width: "90%", borderRadius: "20px", padding: "20px", border: "none" }} disabled={loading || isToday}>
                    <h4>Punch In</h4>
                </Button>
            </div>

            <h5 className='text-center mt-3'>Records</h5>
            <div style={{ maxHeight: "80vh", overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {allRecords.map((record) => {
                    const formattedDate = record.date?.toDate().toLocaleDateString('en-KE', {
                        weekday: 'long', // Full name of the day (e.g., Friday)
                        year: 'numeric', // Full year (e.g., 2024)
                        month: 'long', // Full name of the month (e.g., December)
                        day: 'numeric', // Day of the month (e.g., 29)
                        timeZone: 'Africa/Nairobi',
                    });

                    return (
                        <div
                            key={record.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                backgroundColor: "#DC4523",
                                width: "90%",
                                borderRadius: "10px",
                                padding: "5px 20px",
                                margin: "10px auto 0",
                                color: "white"
                            }}
                        >
                            <div>{formattedDate}</div>
                            <div>{record.duration ? record.duration + ' days' : ''}</div>
                        </div>
                    );
                })}
            </div>

            <NavBar />
        </div>
    )
}

export default Tool