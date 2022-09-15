import { Ref } from "vue";

interface returnValue {
  handlerStatus: (
    value: {
      statusProduct: {
        productIsAdded: boolean | null;
        productIsAdditing: boolean | null;
        additingIsFailed: boolean | null;
        failedText: string | null;
      };
      productAddedIndicator: Ref<any>;
    },
    blockScrolling: boolean
  ) => void;
}

export default function useProductStatus(): returnValue {
  function setIndicator(
    value: {
      statusProduct: {
        productIsAdded: boolean | null;
        productIsAdditing: boolean | null;
        additingIsFailed: boolean | null;
        failedText: string | null;
      };
      productAddedIndicator: Ref<any>;
    },
    blockScrolling: boolean
  ) {
    document.body.style.overflow = blockScrolling ? "hidden" : "visible";
    const status = value.statusProduct.productIsAdded ? "success" : "failed";
    new Promise<void>((resolve) => {
      value.productAddedIndicator.value.$el.style.display = "flex";
      value.productAddedIndicator.value.$el.classList.add(status);
      resolve();
    })
      .then(() => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            value.productAddedIndicator.value.$el.classList.add("active");
            resolve();
          }, 100);
        });
      })
      .then(() => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            if (!value.productAddedIndicator.value?.$el) return;
            value.productAddedIndicator.value.$el.classList.remove("active");
            resolve();
          }, 2000);
        });
      })
      .then(() => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            if (!value.productAddedIndicator.value?.$el) return;
            value.productAddedIndicator.value.$el.classList.add("fade");
            document.body.style.overflow = "visible";
            resolve();
          }, 1000);
        });
      })
      .then(() => {
        setTimeout(() => {
          value.statusProduct.productIsAdded = null;
        }, 1000);
      });
  }

  function handlerStatus(
    value: {
      statusProduct: {
        productIsAdded: boolean | null;
        productIsAdditing: boolean | null;
        additingIsFailed: boolean | null;
        failedText: string | null;
      };
      productAddedIndicator: Ref<any>;
    },
    blockScrolling: boolean
  ) {
    if (value.statusProduct.productIsAdded !== null) {
      setIndicator(
        {
          statusProduct: value.statusProduct,
          productAddedIndicator: value.productAddedIndicator,
        },
        blockScrolling
      );
      if (value.statusProduct.failedText)
        value.productAddedIndicator.value.$el.querySelector(
          ".item-status__mention"
        ).textContent = value.statusProduct.failedText;
    } else {
      value.productAddedIndicator.value.$el.style.display = "none";
      value.productAddedIndicator.value.$el.classList.remove("fade");
      value.productAddedIndicator.value.$el.classList.remove("success");
      value.productAddedIndicator.value.$el.classList.remove("failed");
      // document.body.style.overflow = "visible";
    }
  }

  return { handlerStatus };
}
