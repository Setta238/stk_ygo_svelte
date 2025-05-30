<script lang="ts">
  import type { ModalArgsBase } from "@ygo_duel_view/class/DuelModalBase";
  export let args: ModalArgsBase;
</script>

<div class="modal_window modal_window_{args.position.toLowerCase()}">
  <div class="modal_window_header">{args.title}</div>
  <div class="modal_window_body"><slot name="body"></slot></div>
  <div class="modal_window_footer">
    <slot name="footer"></slot>
  </div>
</div>

<style>
  .modal_window {
    display: block;
    background-color: white;
    opacity: 0.9;
    max-width: 50%;
    width: fit-content;
    padding: 1rem;
  }
  .modal_window_bottom {
    position: fixed;
    bottom: 0px;
  }
  .modal_window * {
    pointer-events: initial;
  }
</style>
