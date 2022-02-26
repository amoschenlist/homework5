/* eslint-disable vue/no-mutating-props */
/* eslint-disable no-undef */
import cartProductModalFormJS from './moadlCartProduct.js';
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

//檢視 VeeValidate; VeeValidateRules; VeeValidateI18n;
console.log('VeeValidate',VeeValidate);
console.log('VeeValidateRules',VeeValidateRules);
console.log('VeeValidateI18n',VeeValidateI18n);

// eslint-disable-next-line no-undef
const app = Vue.createApp({
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
	  paginationData: {},
	  totalProducts: 0,
			form: {
		user: {
		  name: '',
		  email: '',
		  tel: '',
		  address: '',
		},
		message: '',
	  },
	  cart: {},
	};
	},
	methods: {
		render() {  
		 this.getData();       
		},

		// 取得產品資料
		getData(page = 1) {
		   const url = `${this.apiUrl}/api/${this.apiPath}/products?page=${page}`;
		   axios.get(url).then((response) => {
			  const { products, pagination } = response.data;
			  this.products = products;
			  this.paginationData = pagination;				  
			}).catch((err) => {
			  alert(err.data.message);
			  window.location = 'index.html';
			})		

			const url2 = `${this.apiUrl}/api/${this.apiPath}/products/all`;
			axios.get(url2).then((response) => {		 
			  this.totalProducts = Object.keys(response.data.products).length;  
			}).catch((err) => {
			  alert(err.data.message);
			  window.location = 'index.html';
			})	
			
		},

		getProduct(id) {
		  const url = `${this.apiUrl}/api/${this.apiPath}/product/${id}`;
		  this.loadingStatus.loadingItem = id;
		  axios.get(url).then((response) => {
			this.loadingStatus.loadingItem = '';
			this.tempProductReview = response.data.product;
			this.$refs.refCarProductModal.openModal();
		  }).catch((err) => {
			alert(err.data.message);
		  });
		},
		
		addItemToCart(id, qty = 1) {
		  const url = `${this.apiUrl}/api/${this.apiPath}/cart`;
		  this.loadingStatus.loadingItem = id;
		  const cart = {
			product_id: id,
			qty,
		  };

		  this.$refs.refCarProductModal.hideModal();
		  axios.post(url, { data: cart }).then((response) => {
			alert(response.data.message);
			this.loadingStatus.loadingItem = '';
			this.getCartDataList();
		  }).catch((err) => {
			alert(err.data.message);
		  });
		},
		
		updateCartItem(data) {
		  this.loadingStatus.loadingItem = data.id;
		  const url = `${this.apiUrl}/api/${this.apiPath}/cart/${data.id}`;
		  const cart = {
			product_id: data.product_id,
			qty: data.qty,
		  };
		  axios.put(url, { data: cart }).then((response) => {
			alert(response.data.message);
			this.loadingStatus.loadingItem = '';
			this.getCartDataList();
		  }).catch((err) => {
			alert(err.data.message);
			this.loadingStatus.loadingItem = '';
		  });
		},
		
		deleteCartDataList() {
		  const url = `${this.apiUrl}/api/${this.apiPath}/carts`;
		  axios.delete(url).then((response) => {
			alert(response.data.message);
			this.getCartDataList();
		  }).catch((err) => {
			alert(err.data.message);
		  });
		},
		
		getCartDataList() {
		  const url = `${this.apiUrl}/api/${this.apiPath}/cart`;
		  axios.get(url).then((response) => {
			this.cart = response.data.data;
		  }).catch((err) => {
			alert(err.data.message);
		  });
		},
		
		removeCartItem(id) {
		  const url = `${this.apiUrl}/api/${this.apiPath}/cart/${id}`;
		  this.loadingStatus.loadingItem = id;
		  axios.delete(url).then((response) => {
			alert(response.data.message);
			this.loadingStatus.loadingItem = '';
			this.getCartDataList();
		  }).catch((err) => {
			alert(err.data.message);
		  });
		},
		
		buildOrder() {
		  const url = `${this.apiUrl}/api/${this.apiPath}/order`;
		  const order = this.form;
		  axios.post(url, { data: order }).then((response) => {
			alert(response.data.message);
			this.$refs.form.resetForm();
			this.getCartDataList();
		  }).catch((err) => {
			alert(err.data.message);
		  });
		},		
	},  	
	mounted() {
	this.render();
	this.getCartDataList();
	},  
	components: {
		VForm: Form,
		VField: Field,
		ErrorMessage: ErrorMessage,
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

app.component('frontProductModalName', cartProductModalFormJS);
app.mount('#app');
