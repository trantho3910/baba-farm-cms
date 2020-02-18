import React, {Component} from 'react';
import {Badge, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Card, CardHeader, Button, CardBody, Table} from 'reactstrap';
import classnames from 'classnames';
import ModalImage from "react-modal-image";
import './Merchant.css'

function MerchantRow(props) {
  const merchant = props.merchant;
  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  
  const removeRow = () => {
     let merchant_id = props.merchant_id;   
     let handleEdit = props.handleEdit;
     handleEdit(merchant_id);    
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
    <tr key={merchant.id.toString()}  className = "cssTableProduc">
      <td>{merchant.id}</td>
      <td className = "cssRowName">{merchant.name}</td>
      <td>{merchant.username}</td>
      <td>{merchant.email}</td>
      <td>{merchant.description}</td>
      <td>{merchant.phone}</td>
      <td>{5 * merchant.id }</td>

      {/* <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td> */}
      <td> <Button block color="secondary" onClick = {removeRow.bind(this)} > <i className="fa fa-edit"></i> Edit</Button></td>
    </tr>
  )
}

class Merchant extends Component {

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
    let url = "http://34.92.28.217:8080/api/v1/merchants";
     let res = await this.callGetListProduct(url);
     console.log(res);
     if(res.code == 1 && res.data) {
        this.setState({
          listProduct : res.data.merchants
        });
        console.log(this.state.listProduct);
        console.log(process.env.URL_API);

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
              <Button color="primary" onClick = {this.actionAddUser}><i className="fa fa-plus"></i> Add New Merchant</Button>  
              </CardHeader>      
              <CardBody>
               <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr className = "cssTableTH">
                      <th scope="col">ID</th>
                      <th scope="col" >Name</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Description</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Total Product</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listProduct.map((merchant, index) =>
                      <MerchantRow key={index} merchant={merchant} index = {index} merchant_id = {merchant.id} handleEdit = {this.editProduct}/>
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

export default Merchant;
