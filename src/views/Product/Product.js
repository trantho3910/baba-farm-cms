import React, {Component} from 'react';
import {Badge, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Card, CardHeader, Button, CardBody, Table} from 'reactstrap';
import classnames from 'classnames';
import ModalImage from "react-modal-image";
import './Product.css'

function UserRow(props) {
  const product = props.product;
  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  
  const removeRow = () => {
     let product_id = props.product_id;   
     let handleEdit = props.handleEdit;
     handleEdit(product_id);    
  }

  const getRole = (role) => {

    let result = "Owner";
    
    if(role == 1) {
      result = "Admin"; 
    } else if(role == 2) {
      result = "Member"; 
    } else if(role == 3) {
      result = "Guest"; 
    }
    return result;
  }

  return (
    <tr key={product.id.toString()}  className = "cssTableProduc">
      <td>{product.id}</td>
      <td> 
        <div>
          <img src={product.image} className="thumb-square"  />
        </div>
      </td>
      <td>{product.name}</td>
      <td>{product.origin_price}</td>
      <td>{product.current_price}</td>
      <td>{product.minimum_unit} {product.variation_name}</td>
      <td>{product.range_unit}</td>
      {/* <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td> */}
      <td> <Button block color="secondary" onClick = {removeRow.bind(this)} > <i className="fa fa-edit"></i> Edit</Button></td>
    </tr>
  )
}

class Product extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: new Array(4).fill('1'),
      listProduct : []
    };
    this.editProduct = this.editProduct.bind(this);
  }

  async componentDidMount() {
    let url = "http://61.28.233.43:22222/product/get_list_by_merchant_category?phone=0938553324&token=bcc7e194-5526-45c3-ada0-cde08ba528ec&deviceid=C156776F-C830-45D0-88BE-2851DC96668D&page=0&language=1&merchant_id=1&category_id=5";
     let res = await this.callGetListProduct(url);
     if(res.code == 1 && res.data) {
        this.setState({
          listProduct : res.data.products
        });
        console.log(this.state.listProduct);

     }
  }

  editProduct =  (product_id) => {
      console.log('edit ' + product_id );
      let  product_detail =  `/product/${product_id}`
      this.props.history.push(product_detail);
  }

  callGetListProduct = async (url) => {
    try {
      const response = await fetch(url,{mode: 'cors'})        
      const data = response.json()
      return data;
    } catch (e) {
      console.log('error ', e);
      return null;
    }

  }

  lorem() {
    return (
            <Card>
              <CardHeader>
              <Button color="primary" onClick = {this.actionAddUser}><i className="fa fa-plus"></i> Add New Product</Button>  
              </CardHeader>      
              <CardBody>
               <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr className = "cssTableTH">
                      <th scope="col">ID</th>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">Origin Price</th>
                      <th scope="col">Current Price</th>
                      <th scope="col">Min Order</th>
                      <th scope="col">Note</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listProduct.map((product, index) =>
                      <UserRow key={index} product={product} index = {index} product_id = {product.id} handleEdit = {this.editProduct}/>
                    )}
                  </tbody>
                </Table>
              </CardBody>
              {/* {this.showModalError()} */}
            </Card>
    )
  }

  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">
        {this.lorem()}
        </TabPane>
        <TabPane tabId="2">
         {this.lorem()}
        </TabPane>
        <TabPane tabId="3">
          ${this.lorem()}
        </TabPane>
      </>
    );
  }

 

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12" className="mb-4">
            <Nav tabs>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '1'}
                  onClick={() => { this.toggle(3, '1'); }}
                >
                  <i className="icon-calculator"></i>
                  <span className={this.state.activeTab[3] === '1' ? '' : 'd-none'}> Show</span>
                  {'\u00A0'}<Badge color="success">New</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '2'}
                  onClick={() => { this.toggle(3, '2'); }}
                >
                  <i className="icon-basket-loaded"></i>
                  <span className={this.state.activeTab[3] === '2' ? '' : 'd-none'}> Hide</span>
                  {'\u00A0'}<Badge pill color="danger">29</Badge>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  active={this.state.activeTab[3] === '3'}
                  onClick={() => { this.toggle(3, '3'); }} >
                    <i className="icon-pie-chart"></i>
                    <span className={this.state.activeTab[3] === '3' ? '' : 'd-none'}> Charts</span>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab[3]}>
              {this.tabPane()}
            </TabContent>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Product;
