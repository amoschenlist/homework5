export default {
  template: 
`
  <div class="modal fade" id="reviewProductModal" ref="reviewmodalinner">
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content border-0">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title" id="exampleModalLabel">
                <span>{{ reviewproductinner.title }}</span>
              </h5>
              <button type="button" class="btn-close"
                      data-bs-dismiss="modal" aria-label="Close"></button>
             </div>
            <div class="modal-body">
		    <div class="row">
			<div class="col-md-12">				
			<div class="card my-2">
				<img :src="reviewproductinner.imageUrl"
					 class="card-img-top primary-image" alt="主圖"  />
			</div>					
			<template v-for="(image, id) in reviewproductinner.imagesUrl" :key="id">
				<img
				  v-if="image"
				  :src="image"                 
				  class="images mx-2 my-2" width="100"
				/>
			</template>	 
			</div>
			<div class="col-md-12">	
			<div class="card-body">
                  <h5 class="card-title">
                    {{ reviewproductinner.title }}
                    <span class="badge bg-primary my-2"
                      >{{ reviewproductinner.category }}</span
                    >
                  </h5>
                  <p class="card-text">
                    商品描述：{{ reviewproductinner.description }}
                  </p>
                  <p class="card-text">商品內容：{{ reviewproductinner.content }}</p>
                  <div class="d-flex">
                    <p class="card-text me-2">{{ reviewproductinner.price }}</p>
                    <p class="card-text text-secondary">
                      <del>{{ reviewproductinner.origin_price }}</del>
                    </p>
                    {{ reviewproductinner.unit }} / 元
                  </div>
                </div>
              </div>              
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </div> 
`
 ,
  props: {
    reviewproductinner :{
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      status: {},
      reviewmodalinner: '',
      qty: 1,
    };
  },
  mounted() {
    this.reviewmodalinner = new bootstrap.Modal(this.$refs.reviewmodalinner, {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    openModal() {
      this.reviewmodalinner.show();
    },
    hideModal() {
      this.reviewmodalinner.hide();
    },
  },
}