import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import allCounter, { getCartToEdit, switchAttrib, deleteItem } from '../redux/cart/editCart/actions';
import updateCart from '../redux/cart/addCart/action';
import toggleMiniCart, { toggleDropdown, displayDelete, setIndex } from '../redux/display/action';

class MiniCart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.wrapperRef = React.createRef();
    this.MuiltRefFunc = React.createRef();
    this.deleteHandler = this.deleteHandler.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    const { allCart, getCartToEdit } = this.props;
    const data = allCart.slice();
    getCartToEdit(data);
    setTimeout(() => {
      this.initialAttributesStyle(data);
    }, 1300);
    document.addEventListener('click', this.handleClickOutside);
  }

  componentDidUpdate() {
    const { allCart, getCartToEdit } = this.props;
    this.initialAttributesStyle(allCart);
    getCartToEdit(allCart);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside(event) {
    const { symbolWrap, toggleDropdown, dropDownActive } = this.props;

    if (symbolWrap && !symbolWrap.contains(event.target) && dropDownActive) {
      toggleDropdown();
    }
  }

    increment = (index, updateCart) => {
      const { allCounter, allCart, displayDelete } = this.props;
      allCounter(allCart, 'add', index, updateCart, displayDelete);
    }

      decrement = (index, updateCart) => {
        const {
          allCounter, allCart, displayDelete, setIndex,
        } = this.props;
        allCounter(allCart, 'substract', index, updateCart, displayDelete);
        setIndex(index);
      }

      deleteHandler = (index) => {
        const { allCart, displayDelete, updateCart } = this.props;
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
            updateCart, toggleMiniCart, cartDisplay, editCart, symbol,
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
            <div ref={this.wrapperRef} className={`d-flex miniCart-width ${cartDisplay} justify-content-c`}>
              <div className="d-flex minicart-relative mini-container flex-direction-column">
                <div>
                  {' '}
                  <span className="minicart-title">My Bag,</span>
                  {' '}
                  <span className="minicart-qty">{data ? `${Qty} items` : ''}</span>
                </div>
                {data?.map(({
                  cartId, name, count, attributes, galleries, prices,
                }, index) => (
                  <div key={uuidv4()} className="d-flex justify-content-between minicart-border">
                    <div className="d-flex flex-direction-column attributes-minicart-container attributes-container">
                      <h3 className="product-minicart-name">{name}</h3>
                      {prices.filter(({ currency }) => currency.symbol === symbol)
                        .map(({ currency, amount }) => <p className="product-minicart-price" key={currency.symbol}>{`${currency.symbol} ${(amount * count).toFixed(2)}`}</p>)}
                      {attributes.map(({
                        id, name, type, items,
                      }) => (
                        <div key={id}>
                          <p className="cart-attrib-minicart-name">{`${name} :`}</p>
                          <div className="d-flex details-attributes details-minicart-attributes">
                            {
                        items.map(({ id, displayValue }) => (
                          <div key={id}>
                            {
                                type === 'swatch'
                                  ? (
                                    <div>
                                      <div role="none" ref={this.MuiltRefFunc} data-name={name} data-id={displayValue} className={`swatch-container pointer-event-none ${name.split(' ').join('')} h${cartId.slice(0, 8).split('-').join('')}h`}>
                                        <div className="swatch swatch-minicart pointer-event-none" style={{ backgroundColor: displayValue }} />
                                      </div>
                                    </div>
                                  )
                                  : (
                                    <div>
                                      <div role="none" ref={this.MuiltRefFunc} data-id={displayValue} data-name={name} className={`d-flex not-swatch pointer-event-none not-swatch-minicart ${name.split(' ').join('')} h${cartId.slice(0, 8).split('-').join('')}h`}>
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
                    <div className="d-flex cart-counter-image .cart-counter-minicart-image">
                      <div className="d-flex flex-direction-column cart-counter cart-counter-minicart">
                        <div role="none" onMouseDown={() => this.increment(index, updateCart)} className="d-flex counter-change counter-change-minicart"><span>+</span></div>
                        <p>{count}</p>
                        <div role="none" onMouseDown={() => this.decrement(index, updateCart)} className="d-flex counter-change counter-change-minicart"><span>-</span></div>
                      </div>
                      <div className="minicart-img-container"><img src={galleries.currentGallery} alt="gallery" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>
                    </div>

                  </div>
                ))}
              </div>
              <div className="d-flex flex-direction-column mini-order-style">
                <div className="d-flex mini-cart-checkout mini-cart-order-top">
                  <span className="mini-cart-order-title">Tax :</span>
                  <span className="mini-cart-order-value">{`${symbol} ${tax}`}</span>
                </div>
                <div className="d-flex mini-cart-checkout cart-total">
                  <span className="mini-cart-order-title">Total :</span>
                  <span className="mini-cart-order-value">{`${symbol} ${data ? (sum + tax).toFixed(2) : ''}`}</span>
                </div>
                <div className="d-flex button-space-btw">
                  <Link onClick={toggleMiniCart} className="d-flex" to="/cart"><button className="details-minicart-button view-bag-btn order-btn" type="button">view bag</button></Link>
                  <button disabled className="details-button details-minicart-button order-btn" type="button">check out</button>
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
  toggleMiniCart,
  toggleDropdown,
  displayDelete,
  deleteItem,
  setIndex,
};

function mapStateToProps(state) {
  const { editCart } = state;
  const { allCart } = state;
  const { dropDownActive } = state;
  const { miniCartActive } = state;
  return {
    editCart,
    allCart,
    miniCartActive,
    dropDownActive,
  };
}

MiniCart.propTypes = {
  symbolWrap: PropTypes.instanceOf(Element).isRequired,
  allCart: PropTypes.instanceOf(Array).isRequired,
  cartDisplay: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  setIndex: PropTypes.func.isRequired,
  dropDownActive: PropTypes.bool.isRequired,
  getCartToEdit: PropTypes.func.isRequired,
  displayDelete: PropTypes.func.isRequired,
  allCounter: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
  editCart: PropTypes.instanceOf(Array).isRequired,
  toggleMiniCart: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, actionCreators)(MiniCart);
