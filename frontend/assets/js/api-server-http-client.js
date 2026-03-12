class ApiServerHttpClient {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getServicesV1() {
    const response = await fetch(`${this.baseUrl}/api/v1/services`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async postServiceV1(payload) {
    const response = await fetch(`${this.baseUrl}/api/v1/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async deleteServiceV1(id) {
    const response = await fetch(`${this.baseUrl}/api/v1/services/${id}`, {
       method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getServiceV1(id) {
    const response = await fetch(`${this.baseUrl}/api/v1/services/${id}`, {
       method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getJourneysV1() {
    const response = await fetch(`${this.baseUrl}/api/v1/journeys`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async postJourneyV1(payload) {
    const response = await fetch(`${this.baseUrl}/api/v1/journeys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getJourneyV1(id) {
    const response = await fetch(`${this.baseUrl}/api/v1/journeys/${id}`, {
       method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getJourneyViewV1(id) {
    const response = await fetch(`${this.baseUrl}/api/v1/journeys/view/${id}`, {
       method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
  

  async deleteJourneyV1(id) {
    const response = await fetch(`${this.baseUrl}/api/v1/journeys/${id}`, {
       method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }


}

export default ApiServerHttpClient;