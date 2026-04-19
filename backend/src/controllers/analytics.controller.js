import analyticsService from '../services/analytics.service.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const analytics = await analyticsService.getUserAnalytics(userId);

    res.json({
      success: true,
      analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getDashboardAnalytics
};
