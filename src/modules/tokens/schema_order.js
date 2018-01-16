  
  // {
  //   cancelledAmountB: "0x0"
  //   cancelledAmountS: "0x0"
  //   dealtAmountB: "0x0"
  //   dealtAmountS: "0x0"
  //   originalOrder: 
  //     address: "0x1661D680C4C19b7Bcc7aA7c4330a4a6c3200244a"
  //     amountB: "0x2b5e3af16b1880000"
  //     amountS: "0xe6ed27d6668000"
  //     buyNoMoreThanAmountB: true
  //     hash: "0x048e62bfa2378e303fab8e48b474f6132a51268e2aea8ae2b4cfea6562e34e59"
  //     lrcFee: "0xb1a2bc2ec50000"
  //     marginSplitPercentage: "0x32"
  //     protocol: "0x03E0F73A93993E5101362656Af1162eD80FB54F2"
  //     salt: "0x3f445cd"
  //     timestamp: 1515997219
  //     tokenB: "LRC"
  //     tokenS: "WETH"
  //     ttl: "0xe10"
  //     v: "0x1c"
  //     r: "0x0b31f70267047a51d116b9c7c5b6704f5817cc48762855c3d3a7fafc4c7fd9c7"
  //     s: "0x376a8411656dc6ea8b222d052e53b042071366d2329a0570bc5ea2819e72c389"
  //   status: "ORDER_NEW"
  // }

  {/*
  <vaadin-grid aria-label="Basic Binding Example" items="[[orders]]">
      <vaadin-grid-column width="50px">
          <template class="header">Amount</template>
          <template>
              <pretty-number v="[[item.amount]]" d=[[item.amountVolumnPrecision]] postfix="[[item.amountToken]]"></pretty-number>
          </template>
          <template class="footer"></template>
      </vaadin-grid-column>
      <vaadin-grid-column width="50px">
          <template class="header">Price</template>
          <template>
              <pretty-number v="[[item.price]]" d=[[item.pricePrecision]]></pretty-number>
          </template>
          <template class="footer"></template>
      </vaadin-grid-column>
      <vaadin-grid-column width="50px">
          <template class="header">Size</template>
          <template>
              <pretty-number v="[[item.size]]" d=[[item.sizeVolumnPrecision]] postfix="[[item.sizeToken]]"></pretty-number>
          </template>
          <template class="footer"></template>
      </vaadin-grid-column>
      <vaadin-grid-column width="50px">
          <template class="header">Status</template>
          <template>
              <div  class="status">
              <div id="progress[[index]]" class="front">
                  <paper-progress value="[[item.totalDealed]]" secondary-progress="[[item.dealedAndCanceled]]" max="[[item.total]]"></paper-progress>
                  <paper-tooltip for="progress[[index]]" position="left">
                      <div>
                          <div>Original: [[item.total]]</div>
                          <div>Filled: [[item.totalDealed]]</div>
                          <div>Cancelled: [[item.totalCanceled]]</div>
                      </div>
                  </paper-tooltip>
              </div>
                  <div id="warn[[index]]" class="tail ">
                  <template is="dom-if" if="[[item.warning]]">
                      <iron-icon  class="warning" icon="warning"></iron-icon>
                      <paper-tooltip for="warn[[index]]" position="left">
                          [[item.description]]
                      </paper-tooltip>
                  </template>
                  </div>
              </div>
          </template>
          <template class="footer"></template>
      </vaadin-grid-column>
      <vaadin-grid-column width="50px">
          <template class="header">
              <div class="left-aligned">Time</div>
          </template>
          <template>
              <div class="left-aligned">
                  <time-str seconds="[[item.originalOrder.timestamp]]"></time-str>
              </div>
          </template>
          <template class="footer"></template>
      </vaadin-grid-column>
      <vaadin-grid-column hidden$="[[hiddenCancel]]" width="50px">
          <template class="header">
              <div class="left-aligned">Operations</div>
          </template>
          <template>
              <div class="operations">
                  <a href="javascript:void(0)" order="[[item.originalOrder]]" on-click="_cancel">Cancel</a>
              </div>
          </template>
          <template class="footer"></template>
      </vaadin-grid-column>
  </vaadin-grid>
*/}

const schema = [
    {
      title:'Order',
      name:'orderHash',
    },
    {
      title:'Type',
      name:'orderHash', // TODO
    },
    
    {
      title:'Ring',
      description:'The ring hash',
      name:'ringHash',
    },
    {
      title:'RingIndex',
      name:'ringIndex',
    },
    {
      title:'FillIndex',
      name:'FillIndex',
    },
    {
      title:'BlockNumber',
      description:'The number of the block which contains the transaction.',
      name:'blockNumber',
    },
    {
      title:'Order',
      name:'orderHash',
    },
    {
      title:'Type',
      name:'type', // TODO
    },
    {
      title:'LrcFee',
      description:'The total lrc fee.',
      name:'lrcFee',
    },
    {
      title:'Time',
      description:'The ring matched time',
      name:'timestamp',
    },
  ]
  export default schema
