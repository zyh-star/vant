export default {
  methods: {
    getMeaning(name = "") {
      const reg = new RegExp(`^${name}.`);
      const item = this.binds.find((item) => {
        return reg.test(item.bind);
      });
      if (item) {
        return item.name;
      }
      return name;
    },
    getRules(props) {
      const {
        rules = [],
        required = false,
        label = "",
        title = label,
        type = "text",
      } = props;
      if (rules.length > 0) {
        return rules;
      }
      switch (type) {
        case "date":
        case "single":
        case "multiple":
          return [{ required, message: `请选择${title}` }];
        default:
          return [{ required, message: `请输入${title}` }];
      }
    },
    getPlaceholder(props) {
      const {
        placeholder = "",
        type = "text",
        label = "",
        title = label,
      } = props;
      if (placeholder) {
        return placeholder;
      }
      switch (type) {
        case "date":
        case "single":
        case "multiple":
          return `请选择${title}`;
        default:
          return `请输入${title}`;
      }
    },
    singleConfirm(item, props) {
      const { confirm } = props;
      props.value = item;
      const reg = new RegExp(`^${props.name}\\.`);
      const binds = this.binds.filter(({ bind = "" }) => reg.test(bind));
      for (let i = 0; i < binds.length; i++) {
        const { bind = "", cascadesChildFields = [] } = binds[i];
        const key = bind.split(".")[1];
        binds[i].value = item[key];
        for (let j = 0; j < cascadesChildFields.length; j++) {
          const cascadesChildField = cascadesChildFields[j];
          const { cascadesFields = [] } = cascadesChildField;
          cascadesChildField.disabled = cascadesFields.some(
            ({ value = "" }) => value === ""
          );
        }
      }

      if (typeof confirm === "function") {
        confirm(item, props);
      }
    },
    multipleConfirm(array = [], props) {
      const { confirm } = props;
      const reg = new RegExp(`^${props.name}\\.`);
      const binds = this.binds.filter((item) => reg.test(item.bind));
      props.value = array;
      for (let i = 0; i < binds.length; i++) {
        const { bind = "", cascadesChildFields = [] } = binds[i];
        const key = bind.split(".")[1];
        const value = array.reduce((prev, next) => {
          return prev + (prev === "" ? next[key] : `,${next[key]}`);
        }, "");
        binds[i].value = value;
        for (let j = 0; j < cascadesChildFields.length; j++) {
          const cascadesChildField = cascadesChildFields[j];
          const { cascadesFields = [] } = cascadesChildField;
          cascadesChildField.disabled = cascadesFields.some(
            ({ value = "" }) => value === ""
          );
        }
      }

      if (typeof confirm === "function") {
        confirm(array, props);
      }
    },
    getClick(item, props) {
      const { click } = props;
      if (typeof click === "function") {
        click(item, props);
      }
    },
    getClickLeftIcon(item, props) {
      const { clickLeftIcon } = props;
      if (typeof clickLeftIcon === "function") {
        clickLeftIcon(item, props);
      }
    },
    getClickRightIcon(item, props) {
      const { clickRightIcon } = props;
      if (typeof clickRightIcon === "function") {
        clickRightIcon(item, props);
      }
    },
    // getCascades(fields) {
    //   const { cascades = {} } = fields;
    //   const json = {};
    //   for (let key in cascades) {
    //     const item = this.value.find((item) => item.name === cascades[key]);
    //     if (item) {
    //       json[key] = item.value;
    //     } else {
    //       json[key] = "";
    //     }
    //   }
    //   return json;
    // },
    // getField(field) {
    //   const { value, rules, placeholder, cascades, ...item } = field;
    //   return item;
    // },
    getFields(field, binds) {
      const { name = "", value = {} } = field;
      const reg = new RegExp(`^${name}` + "\\.");

      const _binds = binds.filter((item) => {
        return reg.test(item.bind);
      });
      return _binds.map((item) => {
        const { name: _name, bind } = item;
        const reg = new RegExp(`^${name}.`);
        const key = item.key || bind.replace(reg, "");
        return {
          name: _name,
          key,
          value: value[key] || "",
        };
      });
    },
    onSingle(props, index) {
      const key = `single${index}`;
      this.$refs[key][0].onSearch(props);
    },
    onMultiple(props, index) {
      const key = `multiple${index}`;
      this.$refs[key][0].onSearch(props);
    },
  },
};
