<script lang="ts">
  import type { ModalArgsBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
  import type { EventHolder } from "@stk_utils/components/modal_container/StkModalController";
  export let args: ModalArgsBase;
  export let eventHolder: EventHolder;

  let isDragging = false;
  const onDragStart = () => {
    isDragging = true;
  };
  const onDragEnd = () => {
    isDragging = false;
  };
  eventHolder.onDragStart.append(onDragStart);
  eventHolder.onDragEnd.append(onDragEnd);
</script>

<div class="modal_window modal_window_{args.position.toLowerCase()} {isDragging ? 'modal_window_is_dragging' : ''}">
  {#if !isDragging}
    <div class="modal_window_header">{args.title}</div>
  {/if}
  <div class="modal_window_body"><slot name="body"></slot></div>
  <div class="modal_window_footer">
    <slot name="footer"></slot>
  </div>
</div>

<style>
  .modal_window {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #fff 80%, #e0f7fa 100%);
    box-shadow:
      0 8px 32px 0 rgba(31, 38, 135, 0.18),
      0 1.5px 6px 0 rgba(0, 0, 0, 0.08);
    border-radius: 1.2rem;
    opacity: 0.98;
    min-width: 28rem;
    max-width: 95vw;
    padding: 1.2rem 1.5rem 1.2rem 1.5rem;
    margin: 2rem auto;
    transition:
      box-shadow 0.3s,
      transform 0.2s;
    animation: modal_in 0.25s cubic-bezier(0.4, 0.2, 0.2, 1);
  }
  .modal_window_bottom {
    position: fixed;
    bottom: 0px;
    margin: 0px;
  }
  .modal_window_is_dragging {
    transform: scale(0.5);
    transform-origin: bottom;
  }
  @media (max-width: 600px) {
    .modal_window {
      width: 98vw;
      min-width: 0;
      padding: 0.5rem 0.2rem;
      margin: 0.5rem auto;
    }
  }
  @keyframes modal_in {
    from {
      opacity: 0;
      transform: translateY(2rem) scale(0.98);
    }
    to {
      opacity: 0.98;
      transform: translateY(0) scale(1);
    }
  }
  .modal_window_header {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1976d2;
    margin-bottom: 1rem;
    letter-spacing: 0.05em;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.5rem;
  }
  .modal_window_body {
    flex: 1 1 auto;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
    text-align: center;
    word-break: break-word;
    max-width: 90vw;
    overflow-x: auto;
  }
  .modal_window_footer {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e0e0e0;
  }
  .modal_window * {
    pointer-events: initial;
  }
</style>
