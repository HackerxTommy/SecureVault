import reportService from '../services/reportEngine.service.js';
import Report from '../models/Report.js';

export const generateReport = async (req, res) => {
  try {
    const { scanId, format } = req.body;
    const userId = req.user._id;

    let result;

    switch (format) {
      case 'json':
        result = await reportService.generateJSONReport(scanId, userId);
        res.json({
          success: true,
          format: 'json',
          report: result.report,
          reportId: result.reportDoc._id
        });
        break;

      case 'html':
        result = await reportService.generateHTMLReport(scanId, userId);
        res.setHeader('Content-Type', 'text/html');
        res.send(result.html);
        break;

      case 'csv':
        result = await reportService.generateCSVReport(scanId, userId);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="findings.csv"');
        res.send(result.csv);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported report format'
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const listReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const reports = await Report.find({ userId })
      .sort({ createdAt: -1 })
      .populate('scanId', 'targetUrl targetType');

    res.json({
      success: true,
      reports,
      total: reports.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await Report.findOne({ _id: reportId, userId })
      .populate('scanId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  generateReport,
  listReports,
  getReport
};
