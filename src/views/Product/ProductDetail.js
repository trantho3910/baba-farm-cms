import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Modal, ModalBody, ModalFooter, ModalHeader, Input,FormGroup, Label, Button, CardFooter} from 'reactstrap';
import Gallery from 'react-grid-gallery';


class ProductDetail extends Component {

    constructor(props) {
        super(props)
        
        // this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
          product: null,
          isLoading: true,
          isDiable : false,
          name : 'Update',
          files: [],
          wasClicked: false,
          selectedIndex: 0,
          selectedID: "",
          modal: false,
          info: false,
          warning: false,
          attribute : {},
          attributes : [],
          product_id : 0,
          product_name : "aaaa"
        };
        this.state.Images = [];
        this.drawRow = this.drawRow.bind(this);
        this.handlePondFile = this.handlePondFile.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);
        this.toggleInfoGoBack = this.toggleInfoGoBack.bind(this);
        this.toggleWarning = this.toggleWarning.bind(this);
    }

    handleInit() {
      console.log('FilePond instance has initialised', this.pond);
   }
   fetchImages() {
    //  console.log('fetchImages');
    //  agent.get("http://localhost:3001/api/image").then((res) => {
    //     this.setState({ images: res.body }, () => {
    //         this.setState({
    //             selectedID: this.state.images[this.state.selectedIndex].id,
    //         })
    //     })
    //     console.log(res.body)
    // })
}

handleInputChange = key => (event) => {
  this.setState({ 
    [key]: event.target.value 
  });

  console.log(this.state[key]);
  console.log(event.target.value);

}


handleOnClick(e) {
    const index = this.state.images.findIndex(i => i.id === e.target.id)
    this.setState({
        selectedIndex: index,
        wasClicked: true,
        selectedID: e.target.id,
    })
    setTimeout(() => {
        this.setState({ wasClicked: false })
    }, 500)
}

    // handleInputChange(event) {
    //   console.log("change " + event.target.value );
    //   this.setState({
    //     product: {
    //         ...this.state.product,
    //         [event.target.name]: event.target.value,
    //       },
    //     });
    // }

    handleSubmit() {
       if(this.state.isDiable) {
        this.setState( {
            isDiable : false,
            name : 'Update'
          });
        } else {
            this.handleUpdate();
        }
       
    }

    async handleUpdate() {
       let productID = this.props.match.params.id;
       let title  = this.state.product.title;
       let description = this.state.product.description;
       let iGoldCost = this.state.product.igoldcost;
       let luckySpinCost = this.state.product.luckyspincost;
       let luckyspinratio = this.state.product.luckyspinratio;
       let type = this.state.product.type;
       let luckyspintotal = this.state.product.luckyspintotal;
       let howtouse = this.state.product.howtouse;
       let applycondition = this.state.product.applycondition;
       let expireddate = this.state.product.expireddate;


       if(title == null || description == null || iGoldCost == null || 
        luckySpinCost == null || luckyspinratio == null || 
        luckyspintotal == null || howtouse == null || applycondition == null || expireddate == null) {
         console.log('input null');
         return;
       }

       let res = await this.callUpdateProduct(productID, title, description, iGoldCost, luckySpinCost, luckyspinratio, type, luckyspintotal, howtouse,applycondition, expireddate);
       if(res && res.code == 1) {
         console.log('update success');
        //  this.setState( {
        //   isDiable : true,
        //   name : 'Edit'
        // });
        this.toggleInfo();
        
       } else {
        this.setState( {
          isDiable : false,
          name : 'Update'
        });
        this.toggleWarning();
        let msg ='';
        if(res) {
           msg = res.msg
        }
         console.log('update error ',msg);
        
       }
       
    }

    callUpdateProduct = async (productID, title, description, igoldcost, luckyspincost, luckyspinratio, type, luckyspintotal, howtouse,applycondition, expireddate) => {
      try {
        this.urlLogin = "";  
        const url = this.urlLogin +'product/update';
        console.log(url);
        const response = await fetch(url,{
          method: "POST",
          mode: 'cors',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({id : productID, title : title, description : description, igoldcost : igoldcost, luckyspincost : luckyspincost, luckyspinratio : luckyspinratio, type : type,  luckyspintotal : luckyspintotal, howtouse : howtouse, applycondition : applycondition, expireddate : expireddate})
        })        
        const data = response.json()
        return data;
      } catch (e) {
        console.log('error ', e);
        return null;
      }
    }


    async componentDidMount() {
        let res = await this.callGetListProduct();
        if(res && res.code == 1) {
          const product = res.data.product;
          let listPhoto = product.images;
          for(let i = 0; i < listPhoto.length; i++){
            let photo = listPhoto[i];
             let obj = new Object();
             obj.src = photo;
             obj.thumbnail = photo;
             obj.thumbnailWidth = 100;
             obj.thumbnailHeight = 100;
             this.state.Images.push(obj); 
          }

          this.setState({
            product, 
            isLoading: false, 
            product_id : product.id, 
            product_name : product.name
          });
          console.log(product);
        } else {
          console.log('error get list users');
          this.setState({ product: null, isLoading: false });
        }

        res = await this.callGetListAttribute();
        if(res && res.code == 1) {
            let _attributes = res.data.attributes;
            let _arr;
            for(_arr of _attributes) {
                if(_arr.id == this.state.product.variation_group) {
                  console.log(_arr);
                  this.setState({
                    attribute : _arr,
                    attributes : _attributes
                  });
                }
            }
            console.log(this.state.attribute);
        } else {
          console.log('error callGetListAttribute');
        } 

    } 

    callGetListProduct = async () => {
        try {
          const url = "http://61.28.233.43:22222/product/detail?language=1&variation_group=0&token=abc&phone=&deviceid=&product_id=41";
          
          const response = await fetch(url,{mode: 'cors'})        
          const data = response.json()
          return data;
        } catch (e) {
          console.log('error ', e);
          return null;
        }
      }

      callGetListAttribute = async () => {
        try {
          const url = "http://61.28.233.43:22222/app/get_all_attribute?phone=0938553324&token=bcc7e194-5526-45c3-ada0-cde08ba528ec&deviceid=C156776F-C830-45D0-88BE-2851DC96668D&page=1&language=1";
          
          const response = await fetch(url,{mode: 'cors'})        
          const data = response.json()
          return data;
        } catch (e) {
          console.log('error ', e);
          return null;
        }
      }

    
      drawRow (key, value){
        if(key != "images" && key != "attribute_types") 
           return ( <Input type="text"  disabled = {this.state.isDiable} name= {key} value = {value} onChange={this.handleInputChange} />)  
        }

      

  

    handlePondFile(error, file) {
      if (error) {
          console.log('Oh no');
          return;
      }
      console.log('File added', file.serverId);
      //this.fetchImages()
    }

    handleImage() {
      
      return(<FormGroup row>
        <Col md="2"> 
                   <Label htmlFor="company" > Images </Label> 
         </Col>
         <Col  md="10"> 
            <Gallery  customControls={[
                    // <Button color="danger" onClick={this.deleteImage}>Delete This Image</Button>
]} maxRows = {1} showLightboxThumbnails = {true}  currentImageWillChange={this.onCurrentImageChange} rowHeight = {75} images={this.state.Images}/>
         </Col>
       </FormGroup>)
  
  
}

toggleWarning() {
  this.setState({
    warning: !this.state.warning,
  });
}

toggleInfoGoBack() {
  this.setState({
    info: !this.state.info,
  });
  if(this.state.info) {
    this.props.history.push('/products');
  }
}

toggleInfo() {
  this.setState({
    info: !this.state.info,
  });
}

showModalSuccess() {
  return(
    <Modal isOpen={this.state.info} toggle={this.toggleInfo}
    className={'modal-info ' + this.props.className}>
    <ModalHeader toggle={this.toggleInfo}>Success</ModalHeader>
    <ModalBody>
    Update Product Successfully
    </ModalBody>
    <ModalFooter>
        <Button color="primary" onClick={this.toggleInfoGoBack}>Back To List</Button>{' '}
        <Button color="secondary" onClick={this.toggleInfo}>OK</Button>
    </ModalFooter>
    </Modal>)
}

showModalError() {
  return (
<Modal isOpen={this.state.warning} toggle={this.toggleWarning}
className={'modal-warning ' + this.props.className}>
<ModalHeader toggle={this.toggleWarning}>Error</ModalHeader>
<ModalBody>
Update Fail
</ModalBody>
<ModalFooter>
<Button color="warning" onClick={this.toggleWarning}>OK</Button>{}
</ModalFooter>
</Modal>
  );
}
drawLabel = (key) => {
  return ( <Label htmlFor="company" > {key.charAt(0).toUpperCase() + key.substr(1)} </Label> )
}

drawRows = (key ,name, value, isDisable) => {
    return (
        <FormGroup row key={name} >
            <Col md="2"> 
            <Label htmlFor="company" > {name} </Label>
            </Col>                    
            <Col  md="10">
            <Input type="text"  disabled = {isDisable} name= {name} value = {this.state[key]} onChange={this.handleInputChange(key)} />
            </Col> 

        </FormGroup>
    
    )
}
 


drawRowSelect = (name, value, isDisable) => {
  return (
      <FormGroup row key={name} >
          <Col md="2"> 
          <Label htmlFor="company" > {name} </Label>
          </Col>                    
          <Col  md="10"> 
          <Input type="select" name="select" id="select"  disabled = {isDisable} onChange={this.handleInputChange('product_unit')}>
            {this.state.attributes.map((value, index) =>
              <option key = {index}  value={value.id}> {value.name}</option>
            )}
          </Input>
          </Col> 

      </FormGroup>
  
  )
}

  render() {

    const { product, isLoading } = this.state;
    if(isLoading) {
        return ('loading...');
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Update Product Info</strong>
              </CardHeader>
              <CardBody>
                {this.drawRows('product_id',"ID", product.id, true)}
                {this.drawRows("product_name","Name", product.name, false)}
                {this.drawRows("product_current_price","Current price", product.current_price, false)}
                {this.drawRows("product_origin_price","Origin price", product.origin_price, false)}
                {this.drawRows("product_minimum_unit","Minimum Order", product.minimum_unit, false)}
                {this.drawRowSelect("Unit", product.variation_name, false)}
                {this.drawRows("product_range_unit","Range Unit", product.range_unit, false)}

                     
                {this.handleImage()}
                {this.showModalSuccess()}
                {this.showModalError()}
                     
                   
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick = {this.handleSubmit}><i className="fa fa-dot-circle-o"></i> {this.state.name}</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ProductDetail;