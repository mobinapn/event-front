<template>
  <div class="header-section q-mb-xl">
    <h1 class="text-h4 text-center q-mb-md text-weight-bold">صورتحساب</h1>
    <div class="progress-steps">
      <div class="step complete">
        <div class="step-icon">1</div>
        <span>انتخاب تور</span>
      </div>
      <div class="step complete">
        <div class="step-icon">2</div>
        <span>اطلاعات مسافران</span>
      </div>
      <div class="step active">
        <div class="step-icon">3</div>
        <span>پرداخت</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header-section {
  text-align: center;

  h1 {
    color: var(--q-primary);
    margin-bottom: 2rem;
  }
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    max-width: 150px;

    &:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 20px;
      right: 50%;
      width: 100%;
      height: 2px;
      background: #e0e0e0;
      z-index: 0;
    }

    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      z-index: 1;
      font-weight: bold;
    }

    span {
      font-size: 0.9rem;
      color: #666;
    }

    &.complete {
      .step-icon {
        background: var(--q-primary);
        color: white;
      }

      &::after {
        background: var(--q-primary);
      }
    }

    &.active {
      .step-icon {
        background: var(--q-primary);
        color: white;
        box-shadow: 0 0 0 4px rgba(var(--q-primary), 0.2);
      }
    }
  }
}
</style>
