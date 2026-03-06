const WorkoutTemplate = require("../../models/workoutTemplate.model");

/**
 * Get templates with pagination + search
 */
exports.getTemplates = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const type = query.type; // system | user | all

  const filter = {
    $or: [{ isSystem: true }, { user: userId }],
  };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (type === "system") {
    filter.isSystem = true;
  }

  if (type === "user") {
    filter.user = userId;
  }

  const [templates, total] = await Promise.all([
    WorkoutTemplate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name description isSystem createdAt"),
    WorkoutTemplate.countDocuments(filter),
  ]);

  return {
    templates,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

/**
 * Get template by ID
 */
exports.getTemplateById = async (templateId) => {
  return WorkoutTemplate.findById(templateId).populate({
    path: "exercises.exercise",
  });
};

/**
 * Create user template
 */
exports.createTemplate = async (data, userId) => {
  return WorkoutTemplate.create({
    ...data,
    user: userId,
    isSystem: false,
  });
};

/**
 * Update template
 */
exports.updateTemplate = async (templateId, data, userId) => {
  const template = await WorkoutTemplate.findById(templateId);

  if (!template) throw new Error("Template not found");

  if (template.isSystem) throw new Error("System templates cannot be modified");

  if (template.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  Object.assign(template, data);

  return template.save();
};

/**
 * Delete template
 */
exports.deleteTemplate = async (templateId, userId) => {
  const template = await WorkoutTemplate.findById(templateId);

  if (!template) throw new Error("Template not found");

  if (template.isSystem) throw new Error("System templates cannot be deleted");

  if (template.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  await template.deleteOne();
};
