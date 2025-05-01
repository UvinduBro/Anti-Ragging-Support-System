import { getFirebaseStorage } from "@/lib/firebase";
import { getFirebaseFirestore } from "../lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  Timestamp,
  addDoc,
  DocumentReference,
  updateDoc,
  serverTimestamp,
  FieldValue,
  getDoc,
  doc,
} from "firebase/firestore";
import { uploadBytes, uploadBytesResumable } from "firebase/storage";
import { Incident } from "server/types/incident.type";
import { v4 as uuidv4 } from "uuid";

interface ReportData {
  incidentType: string;
  location: string;
  date: string;
  time: string | null;
  description: string;
  status: string;
  mediaBase64: string[];
  createdAt: FieldValue;
  updatedAt: FieldValue;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

const getIncidents = async () => {
  try {
    const db = getFirebaseFirestore();
    const reportsRef = collection(db, "reports");

    const allDocsQuery = query(reportsRef);
    const allDocs = await getDocs(allDocsQuery);

    const q = query(
      reportsRef,
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const reports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt instanceof Timestamp
          ? doc.data().createdAt.toDate()
          : doc.data().createdAt,
      updatedAt:
        doc.data().updatedAt instanceof Timestamp
          ? doc.data().updatedAt.toDate()
          : doc.data().updatedAt,
    })) as Incident[];
    return {
      success: true,
      data: reports,
    };
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return {
      success: false,
      message: "Failed to fetch incidents",
    };
  }
};

const createIncident = async (incident: Incident) => {
  try {
    const {
      incidentType,
      location,
      date,
      description,
      time,
      mediaBase64,
      optionalContact,
      contactName,
      contactEmail,
      contactPhone,
    } = incident;

    if (!incidentType || !location || !date || !description) {
      throw new Error("Missing required fields");
    }

    const reportData: any = {
      incidentType,
      location,
      date,
      description,
      docId: `INC-${uuidv4().slice(0, 8).toUpperCase()}`,
      status: "pending",
      mediaBase64: mediaBase64 ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contactName: contactName || "Anonymous",
      contactEmail: contactEmail || "anonymous@example.com",
    };

    // Remove undefined fields
    Object.keys(reportData).forEach(
      (k) => reportData[k] === undefined && delete reportData[k]
    );

    const db = getFirebaseFirestore();
    const docRef = await addDoc(collection(db, "reports"), reportData);

    return { success: true, data: { ...reportData, id: docRef.id } };
  } catch (err: any) {
    console.error("Error creating incident:", err);
    throw new Error(`Failed to create incident: ${err.message}`);
  }
};

const getIncidentById = async (id: string) => {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, "reports", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, message: "Incident not found" };
    }
  } catch (err: any) {
    console.error("Error fetching incident by ID:", err);
    return {
      success: false,
      message: "Failed to fetch incident by ID",
    };
  }
};

export { getIncidents, createIncident, getIncidentById };
