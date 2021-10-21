const Page = require("../models/page");
const slugify = require("slugify");
const shortid = require("shortid");

function createPages(pages, parentId = null) {
  const pageList = [];
  let page;
  if (parentId == null) {
    page = pages.filter((pag) => pag.parentId == undefined);
  } else {
    page = pages.filter((pag) => pag.parentId == parentId);
  }

  for (let pag of page) {
    pageList.push({
      _id: pag._id,
      name: pag.name,
      slug: pag.slug,
      parentId: pag.parentId,
      type: pag.type,
      children: createPages(pages, pag._id),
    });
  }

  return pageList;
}

exports.addPage = (req, res) => {
  const pageObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
  };

  if (req.file) {
    pageObj.pageImage = "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    pageObj.parentId = req.body.parentId;
  }

  const pag = new Page(pageObj);
  pag.save((error, page) => {
    if (error) return res.status(400).json({ error });
    if (page) {
      return res.status(201).json({ page });
    }
  });
};

exports.deletePages = async (req, res) => {
  const { ids } = req.body.payload;
  const deletedPages = [];
  for (let i = 0; i < ids.length; i++) {
    const deletePage = await Page.findOneAndDelete({
      _id: ids[i]._id,
      createdBy: req.user._id,
    });
    deletedPages.push(deletePage);
  }

  if (deletedPages.length == ids.length) {
    res.status(201).json({ message: "Pages removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};

exports.getPages = async (req, res) => {
    const pages = await Page.find({})
    .select("_id title description banner category")
    .populate({ path: "category", select: "_id title" })
    .exec();

  res.status(200).json({ pages });
  };
  