const classNames = {
  DELETE: "delete" };


const logger = {
  logging: false,
  log(msg) {
    if (this.logging) console.log(msg);
  } };


const itemProto = {
  bought: false,
  toggle() {
    this.bought = !this.bought;
    this.trigger("toggled", this);
  } };


const items = {
  list: [],

  add(item) {
    let newItem = Object.create(itemProto);
    Object.assign(newItem, item, Backbone.Events);
    newItem.on("toggled", function (item) {
      logger.log("toggled");
      view.addToList(item);
    });
    newItem.id = _.uniqueId();
    this.list.push(newItem);
    this.trigger("itemAdded", newItem);
    this.trigger("updated");
  },

  delete(id) {
    logger.log("delete: " + id);
    let item = _.find(items.list, {
      "id": id });


    view.remove(item.$el);

    this.list = _.pull(this.list, item);
    this.trigger("updated");
  },

  toggle(id) {
    _.find(items.list, {
      "id": id }).
    toggle();

    this.trigger("updated");
  } };


const app = {
  init() {
    view.init();
    Object.assign(items, Backbone.Events);
    items.on("itemAdded", function (item) {
      logger.log("item added");
      view.addToList(item);
    });

    items.on("updated", function () {
      logger.log("updated");
      view.updateLinks();
    });
  } };


const view = {
  init() {

    this.$wishList = $("#wish-list");
    this.$boughtList = $("#bought-list");
    this.$form = $("form");

    const handleSubmit = function (e) {
      e.preventDefault();

      let name = $("#item-input");
      var link = $("#link-input");

      if (name.val()) {
        items.add({
          name: name.val(),
          link: link.val()});

      }

      name.val("");
      link.val("");

    };

    const handleClick = function (e) {
      e.preventDefault();
      logger.log("Clicked");

      if (e.target.nodeName === "LI") {
        let id = $(e.target).data("id").toString();
        items.toggle(id);
      } else if (e.target.className === classNames.DELETE) {
        let id = $(e.target).parent().data("id").toString();
        items.delete(id);
      }
    };

    const handleDelete = function (e) {
      e.preventDefault();
      logger.log("Delete: " + item);
      let id = $(e.target).data("id").toString(),
      item = _.find(items.list, {
        "id": id });


    };

    $("#lists").on("click", handleClick);
    this.$form.on("submit", handleSubmit);
    $("." + classNames.DELETE).on("click", handleDelete);

  },

  addToList(item, list) {
    let $item = item.$el || this.createListItem(item);

    if (item.bought) {
      $item.prependTo(this.$boughtList);
    } else {
      $item.appendTo(this.$wishList);
    }
  },

  updateLinks() {
    logger.log("updateLinks");
    $("#wish-num").html(this.$wishList.children().length);
    $("#bought-num").html(this.$boughtList.children().length);
  },

  remove($el) {
    $el.remove();
  },

  createListItem(item) {
    item.$el = $(`<li data-id=${item.id}>${item.name} <span class="url">${item.link}</span><span class="delete">X</span></li>`);

    return item.$el;
  },

  getListItem(id) {
    let $el = $("li[data-id='" + id + "']");
    return $el.length ? $el : null;
  },

  render(items) {
    logger.log("render");

    this.$wishList.empty();
    this.$boughtList.empty();

    items.forEach(item => {
      let $item = $(`<li data-id=${item.id}>${item.name}<span>${item.link}</span></li>`);

      if (item.bought) {
        this.$boughtList.append($item);
        $item.addClass("bought");
      } else {
        this.$wishList.append($item);
      }
    });

  } };


app.init();

items.add({
  name: "Fossil Parker Satchel",
  link: link.href = "https://www.fossil.com/en-us/products/parker-satchel/ZB1708001.html"});


items.add({
  name: "Kate Spade 3D Heart Crossbody",
  link: link.href = "https://www.saksfifthavenue.com/product/kate-spade-new-york-amour-3d-heart-leather-crossbody-bag-0400017436978.html?site_refer=CSE_MSNPLA:Womens_Handbags:kate+spade+new+york&CSE_CID=M_Saks_PLA_US_Handbags:Crossbody+Bags&gclid=b97d62982d321f9a208701530e1e3419&gclsrc=3p.ds&msclkid=b97d62982d321f9a208701530e1e3419"}); 