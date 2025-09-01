import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const refineBlueprint = async (query, initialBlueprint) => {
  try {
    const response = await axios.post(`${API}/refine-blueprint`, {
      query,
      initial_blueprint: initialBlueprint
    });
    return response.data;
  } catch (error) {
    console.error('Blueprint refinement failed:', error);
    throw error;
  }
};

export const submitContactForm = async (contactData, blueprintData) => {
  try {
    const response = await axios.post(`${API}/submit-contact`, {
      contact: contactData,
      blueprint: blueprintData,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Contact form submission failed:', error);
    throw error;
  }
};