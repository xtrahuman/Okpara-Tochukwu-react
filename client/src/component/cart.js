import React from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { displayDelete, setIndex } from '../redux/display/action';
import allCounter, {
  updateImage, getCartToEdit, switchAttrib, deleteItem,
} from '../redux/cart/editCart/actions';
import updateCart from '../redux/cart/addCart/action';

class Cart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.moreHandler = this.moreHandler.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
  }

  componentDidMount() {
    const { allCart, getCartToEdit } = this.props;
    const data = allCart.slice();
    getCartToEdit(data);
    setTimeout(() => {
      this.initialAttributesStyle(data);
    }, 1300);
  }

  componentDidUpdate() {
    const { allCart } = this.props;
    this.initialAttributesStyle(allCart);
  }

        moreHandler = (indx, direction) => {
          const { allCart, updateImage, updateCart } = this.props;
          updateImage(allCart, indx, updateCart, direction);
        };

          increment = (index, updateCart) => {
            const { allCounter, allCart, displayDelete } = this.props;
            allCounter(allCart, 'add', index, updateCart, displayDelete);
          }

          decrement = (index, updateCart) => {
            const {
              allCounter, allCart, displayDelete, setIndex,
            } = this.props;
            setIndex(index);
            allCounter(allCart, 'substract', index, updateCart, displayDelete);
          }

          deleteHandler = (index) => {
            const {
              allCart, displayDelete, updateCart, deleteItem,
            } = this.props;
            deleteItem(allCart, index, updateCart);
            displayDelete();
          }

        initialAttributesStyle = (data) => {
          data.forEach(({ cartId, attributes, ...args }) => {
            const values = Object.entries(args);
            attributes?.forEach(({ name }) => {
              const attribName = name.split(' ').join('');
              const getAtribEl = document.querySelectorAll(`.${attribName}`);
              const cartIdCheck = `h${cartId.slice(0, 8).split('-').join('')}h`;
              getAtribEl.forEach((checkAttrib) => {
                const value = checkAttrib.dataset.id;
                values.forEach((myVal) => {
                  if (attribName === myVal[0] && value === myVal[1]) {
                    checkAttrib.classList.forEach((classl) => {
                      if (checkAttrib.classList.value.includes(cartIdCheck)) {
                        if (classl === 'not-swatch') {
                          checkAttrib.classList.add('Active-not-swatch');
                        } else {
                          checkAttrib.classList.add('active-swatch');
                        }
                      }
                    });
                  }
                });
              });
            });
          });
        }

        render() {
          const {
            updateCart, editCart, symbol,
          } = this.props;
          let sum = 0;
          let Qty = 0;
          let tax = 5;
          this.publicData = editCart;
          const data = editCart;
          let total;
          data?.map(({ count, prices }) => {
            prices.filter(({ currency }) => currency.symbol === symbol)
              .map(({ amount }) => {
                total = amount * count;
                return total;
              });
            sum += total;
            Qty += count;
            return sum;
          });

          tax *= Qty;

          return (
            <div className="d-flex justify-content-c">
              <div className="d-flex container flex-direction-column">
                <h2 className="page-title">CART</h2>
                {data?.map(({
                  cartId, name, count, attributes, galleries, prices,
                }, index) => (
                  <div key={uuidv4()} className="d-flex justify-content-between cart-border">
                    <div className="d-flex flex-direction-column attributes-container">
                      <h3 className="product-name">{name}</h3>
                      {prices.filter(({ currency }) => currency.symbol === symbol)
                        .map(({ currency, amount }) => <p className="product-price" key={currency.symbol}>{`${currency.symbol} ${(amount * count).toFixed(2)}`}</p>)}
                      {attributes.map(({
                        id, name, type, items,
                      }) => (
                        <div key={id}>
                          <p className="cart-attrib-name">{`${name} :`}</p>
                          <div className="d-flex details-attributes">
                            {
                        items.map(({ id, displayValue }) => (
                          <div key={id}>
                            {
                                type === 'swatch'
                                  ? (
                                    <div>
                                      <div role="none" ref={this.MuiltRefFunc} data-name={name} data-id={displayValue} className={`swatch-container pointer-event-none ${name.split(' ').join('')} h${cartId.slice(0, 8).split('-').join('')}h`}>
                                        <div className="swatch pointer-event-none" style={{ backgroundColor: displayValue }} />
                                      </div>
                                    </div>
                                  )
                                  : (
                                    <div>
                                      <div role="none" ref={this.MuiltRefFunc} data-id={displayValue} data-name={name} className={`d-flex not-swatch pointer-event-none ${name.split(' ').join('')} h${cartId.slice(0, 8).split('-').join('')}h`}>
                                        <p>{displayValue}</p>
                                      </div>
                                    </div>
                                  )
                            }
                          </div>
                        ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex cart-counter-image">
                      <div className="d-flex flex-direction-column cart-counter">
                        <div role="none" onMouseDown={() => this.increment(index, updateCart)} className="d-flex counter-change"><span>+</span></div>
                        <p>{count}</p>
                        <div role="none" onMouseDown={() => this.decrement(index, updateCart)} className="d-flex counter-change"><span>-</span></div>
                      </div>
                      <div className="cart-img-container">
                        <div className="cart-img-icon-contain d-flex">
                          <span role="none" onMouseDown={() => this.moreHandler(index, 'backward')} className="cart-img-icon d-flex"><FaAngleLeft /></span>
                          <span role="none" onMouseDown={() => this.moreHandler(index, 'forward')} className="cart-img-icon d-flex"><FaAngleRight /></span>
                        </div>
                        <img src={galleries.currentGallery} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    </div>

                  </div>
                ))}
                <div className="d-flex flex-direction-column order-style cart-border">
                  <div>
                    <span className="cart-order-title">Tax :</span>
                    <span className="cart-order-value">{`${symbol} ${tax}`}</span>
                  </div>
                  <div>
                    <span className="cart-order-title">Qty :</span>
                    <span className="cart-order-value">{data ? Qty : ''}</span>
                  </div>
                  <div className="cart-total">
                    <span className="cart-order-title">Total :</span>
                    <span className="cart-order-value">{`${symbol} ${data ? (sum + tax).toFixed(2) : ''}`}</span>
                  </div>
                  <button disabled className="details-button order-btn" type="button">order</button>
                </div>
              </div>
            </div>
          );
        }
}

const actionCreators = {
  allCounter,
  updateCart,
  getCartToEdit,
  switchAttrib,
  updateImage,
  displayDelete,
  deleteItem,
  setIndex,
};

function mapStateToProps(state) {
  const { editCart } = state;
  const { allCart } = state;
  const { getIndex } = state;
  return {
    editCart,
    allCart,
    getIndex,
  };
}

Cart.propTypes = {
  allCart: PropTypes.instanceOf(Array).isRequired,
  getCartToEdit: PropTypes.func.isRequired,
  allCounter: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  setIndex: PropTypes.func.isRequired,
  displayDelete: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  editCart: PropTypes.instanceOf(Array).isRequired,
};

export default connect(mapStateToProps, actionCreators)(Cart);
