const templateService = require("./workoutTemplate.service");

/**
 * GET /api/templates
 */
exports.getTemplates = async (req, res) => {
  try {
    const result = await templateService.getTemplates(req.user.id, req.query);

    res.json({
      success: true,
      data: result.templates,
      pagination: result.pagination,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/templates/:id
 */
exports.getTemplateById = async (req, res) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);

    if (!template)
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });

    res.json({
      success: true,
      data: template,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/templates
 */
exports.createTemplate = async (req, res) => {
  try {
    const template = await templateService.createTemplate(
      req.body,
      req.user.id,
    );

    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * PUT /api/templates/:id
 */
exports.updateTemplate = async (req, res) => {
  try {
    const template = await templateService.updateTemplate(
      req.params.id,
      req.body,
      req.user.id,
    );

    res.json({
      success: true,
      data: template,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * DELETE /api/templates/:id
 */
exports.deleteTemplate = async (req, res) => {
  try {
    await templateService.deleteTemplate(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Template deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
