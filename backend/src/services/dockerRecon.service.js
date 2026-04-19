import axios from 'axios';

class CloudReconService {
  constructor() {
    // Cloud endpoint - can be configured via environment variable
    this.cloudEndpoint = process.env.RECON_CLOUD_ENDPOINT || 'http://localhost:8080';
    this.timeout = 300000; // 5 minutes
  }

  /**
   * Run reconnaissance using cloud API
   * @param {string} target - Target domain or IP
   * @param {object} options - Recon options
   * @returns {Promise<object>} Recon results
   */
  async runRecon(target, options = {}) {
    try {
      const { phase = 'all' } = options;
      
      const response = await axios.post(
        `${this.cloudEndpoint}/api/recon`,
        {
          target,
          phase
        },
        {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Cloud recon error:', error);
      throw new Error(`Cloud recon failed: ${error.message}`);
    }
  }

  /**
   * Check if cloud service is available
   * @returns {Promise<boolean>}
   */
  async isEngineRunning() {
    try {
      const response = await axios.get(`${this.cloudEndpoint}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Set cloud endpoint
   * @param {string} endpoint - Cloud service endpoint
   */
  setEndpoint(endpoint) {
    this.cloudEndpoint = endpoint;
  }
}

export default new CloudReconService();
