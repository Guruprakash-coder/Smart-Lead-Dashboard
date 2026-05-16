import { Request, Response } from 'express';
import Lead from '../models/lead.model';

// @desc    Create a new lead
// @route   POST /api/leads
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?._id // Assigned by the auth middleware
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads (with Pagination, Filtering, Searching, Sorting)
// @route   GET /api/leads
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort, page } = req.query;

    // 1. Build the Query Object
    const query: any = {};

    // Exact match filters
    if (status) query.status = status;
    if (source) query.source = source;

    // Regex Search for Name or Email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // 'i' for case-insensitive
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Pagination Logic (Strict requirement: 10 per page)
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = 10;
    const skip = (pageNumber - 1) * limitNumber;

    // 3. Sorting Logic (Latest vs Oldest)
    let sortOption: any = { createdAt: -1 }; // Default to Latest
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    // 4. Execute Query with Mongoose
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .populate('createdBy', 'name email'); // Optional: Gets the name of the user who created it

    // 5. Get total count for pagination metadata
    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / limitNumber),
      },
      data: leads
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true // Enforces enum checks again
    });

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};