<script lang="ts" module>
  import type { ModalArgsBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
  import { StkModalDefinitionBase } from "@stk_utils/components/modal_container/StkModalDefinitionBase";
  import { StkModalControllerBase, type EventHolder } from "@stk_utils/components/modal_container/StkModalController";
  type ModalMap = {
    deckUploader: StkModalDefinitionBase<DeckUploaderArgs, DeckUploaderResult>;
  };
  export type DeckEditorModalController = DeckEditorModalControllerFactory & ModalMap;
  export class DeckEditorModalControllerFactory extends StkModalControllerBase {
    public static readonly createModalController = (eventHolder: EventHolder): DeckEditorModalController => {
      const modalMap = {
        deckUploader: new StkModalDefinitionBase<DeckUploaderArgs, DeckUploaderResult>({
          title: "デッキ情報をアップロード",
          position: "Middle",
          cancelable: false,
          mainCardNames: [],
          exCardNames: [],
        }),
      } as const;
      return Object.assign(new DeckEditorModalControllerFactory(eventHolder, modalMap), modalMap);
    };

    private constructor(eventHolder: EventHolder, modalMap: ModalMap) {
      super(eventHolder, ...Object.values(modalMap));
    }
  }
</script>

<script lang="ts">
  import StkModalContainer from "@stk_utils/components/modal_container/StkModalContainer.svelte";
  import DeckUploader, { type DeckUploaderArgs, type DeckUploaderResult } from "./DeckUploader.svelte";
  export let modalController: DeckEditorModalController;
</script>

<StkModalContainer {modalController}>
  {#if modalController.deckUploader.state === "Shown"}
    <DeckUploader eventHolder={modalController.eventHolder} args={modalController.deckUploader.args} resolve={modalController.deckUploader.resolve} />
  {/if}
</StkModalContainer>
