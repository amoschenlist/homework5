/* eslint-disable vue/no-mutating-props */
/* eslint-disable no-undef */
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js";
import reviewProductModalFormJS from './modalReviewProduct.js';
let productItemModal = null;
let delProductItemModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "amos-hexschool",
	   loadingStatus: {
        loadingItem: '',
      },
      products: [],
	  tempProductReview: {},
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      paginationData: {},
      totalProducts: 0,
    };
  },
  methods: {
    // 驗證權限後取出產品
    checkAuthRender() {
    // 取出 Token 
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "index.html";
        });
    },

    // 取得產品資料
    getData(page = 1) {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
      axios
        .get(url)
        .then((response) => {
          const { products, pagination } = response.data;
          this.products = products;
          this.paginationData = pagination;		  
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'index.html';
        })
		
		const url2 = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
        axios.get(url2).then((response) => {		 
          this.totalProducts = Object.keys(response.data.products).length;  
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'index.html';
        })				
    },

    // 按下按鈕新增/修改/刪除
    openItemModal(type, item) {
      if (type === "new") {
        //新增
        this.tempProduc = {
          imagesUrl: [],
        };
        this.isNew = true;
        productItemModal.show(); //顯示productModal
      } else if (type === "edit") {
        //修改
        //this.tempProduct = { ...item }; //淺拷貝
		this.tempProduct =  JSON.parse(JSON.stringify(item)); // 深拷貝
		this.tempProduct = { ...item };
        this.isNew = false;
        productItemModal.show(); // 顯示productModal
      } else if (type === "delete") {
        //刪除
        this.tempProduct =  JSON.parse(JSON.stringify(item)); // 深拷貝
        delProductItemModal.show(); //顯示delProductModal
      }
    },
	getProduct(id) {
      const url = `${this.apiUrl}/api/${this.apiPath}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        this.loadingStatus.loadingItem = '';
        this.tempProductReview = response.data.product;
        this.$refs.refReviewProductModal.openModal();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
  },
  mounted() {
    // 驗證權限後取出產品
    this.checkAuthRender();
  },
});

// 產品新增/編輯元件
app.component("productItemModal", {
  template: "#productItemModal",
  props: ["tempProduct", "isNew", "pagesData"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "amos-hexschool",
      modal: null,
      currentPage:1
    };
  },
  mounted() {
    productItemModal = new bootstrap.Modal(
      document.getElementById("productItemModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
  },
  methods: {
    //新增或編輯產品
    updateItemProduct() {
      let url = "";
      let http = "";
      if (this.isNew) {
        //this.isNew為true,新增產品
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        http = "post";
      } else if (!this.isNew) {
        //this.isNew為false,編輯產品
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = "put";
        this.currentPage = this.pagesData.current_page;
      }
      // axios API 新增或編輯產品
      axios[http](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          productItemModal.hide(); //隱藏ProductModal
          this.$emit("updateRender", this.currentPage); //重新render產品列表
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    //新增圖片
    createImagesLink() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
});

// 產品刪除元件
app.component("delProductItemModal", {
  template: "#delProductItemModal",
  props: ["tempProduct","pagesData"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "amos-hexschool",
      modal: null,
    };
  },
  mounted() {
    delProductItemModal = new bootstrap.Modal(
      document.getElementById("delProductItemModal"),
      {
        keyboard: false,
        backdrop: "static",
      }
    );
  },
  methods: {
    // 刪除產品
    delItemProduct() {
      //要刪除的產品api路徑
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      // 使用delete api 刪除一項產品
      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          delProductItemModal.hide(); //隱藏delProductModal
          this.$emit("updateRender",this.pagesData.current_page); //重新render產品列表
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
});

// 分頁元件
app.component('paginationList', {
  template: '#paginationList',
  props: ['pagesData'],
  methods: {
    emitPages(item) {
      this.$emit('emit-pages', item);
    },
  },
});

app.component('reviewProductModalName', reviewProductModalFormJS);
app.mount("#app");
