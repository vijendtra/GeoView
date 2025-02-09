import { api } from "../../../api/api";

import { EVENT_NAMES } from "../../../api/event";

import { ButtonApi, PanelApi, LayersPanel } from "../../../ui";

import {
  TypeButtonPanel,
  TypeButtonProps,
  TypePanelProps,
  CONST_PANEL_TYPES,
} from "../../types/cgpv-types";

import { generateId } from "../../utils/utilities";

/**
 * Class to manage buttons on the appbar
 *
 * @exports
 * @class
 */
export class AppbarButtons {
  mapId!: string;

  panel!: PanelApi;

  // groups of array of button panels to hold all buttons created on the appbar
  buttons: Record<string, Record<string, TypeButtonPanel>> = {};

  /**
   * initialize the buttons for the appbar
   *
   * @param mapId the id of the map this appbar belongs to
   */
  constructor(mapId: string) {
    this.mapId = mapId;

    this.panel = new PanelApi(
      LayersPanel.panel,
      LayersPanel.button.id!,
      this.mapId
    );

    this.createDefaultButtonPanels();
  }

  /**
   * Function used to create default buttons, button panels
   */
  private createDefaultButtonPanels = () => {
    // create default group for appbar button panels
    this.buttons.default = {};

    // TODO: do not keep, just proof of concept
    this.createAppbarPanel(
      {
        ...LayersPanel.button,
        tooltip: api.map(this.mapId).i18nInstance.t("appbar.layers"),
      },
      LayersPanel.panel,
      "default"
    );
  };

  /**
   * Create a group for the appbar buttons
   *
   * @param {string} groupName a group name to be used to manage the group of appbar buttons
   */
  createAppbarButtonGroup = (groupName: string): void => {
    this.buttons[groupName] = {};
  };

  /**
   * Create a button on the appbar that will open a panel
   *
   * @param {TypeButtonProps} buttonProps button properties (icon, tooltip)
   * @param {TypePanelProps} panelProps panel properties (icon, title, content)
   * @param {string} groupName optional value to set this button in a group
   *
   * @returns the created panel
   */
  createAppbarPanel = (
    buttonProps: TypeButtonProps,
    panelProps: TypePanelProps,
    groupName?: string | null | undefined
  ): TypeButtonPanel | null => {
    if (buttonProps && panelProps) {
      // generate an id if not provided
      buttonProps.id = generateId(buttonProps.id);

      // if group was not specified then add button panels to the default group
      if (!groupName) {
        groupName = "default";
      }

      // if group does not exist then create it
      if (!this.buttons[groupName]) {
        this.buttons[groupName] = {};
      }

      // set panel type
      panelProps.type = CONST_PANEL_TYPES.APPBAR;

      const buttonPanel: TypeButtonPanel = {
        id: buttonProps.id,
        panel: new PanelApi(panelProps, buttonProps.id, this.mapId),
        button: new ButtonApi(buttonProps),
        groupName,
      };

      // add the new button panel to the correct group
      this.buttons[groupName][buttonProps.id] = buttonPanel;

      // trigger an event that a new button panel has been created to update the state and re-render
      api.event.emit(EVENT_NAMES.EVENT_APPBAR_PANEL_CREATE, null, {
        buttonPanel,
      });

      return buttonPanel;
    }

    return null;
  };

  /**
   * Get a button panel from the appbar by using it's id
   *
   * @param {string} id the id of the button panel to get
   * @returns {TypeButtonPanel} the returned button panel
   */
  getAppBarButtonPanelById = (id: string): TypeButtonPanel | null => {
    // loop through groups of appbar button panels
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < Object.keys(this.buttons).length; i++) {
      const group = this.buttons[Object.keys(this.buttons)[i]];

      // eslint-disable-next-line no-plusplus
      for (let j = 0; j < Object.keys(group).length; j++) {
        const buttonPanel: TypeButtonPanel = group[Object.keys(group)[j]];

        if (buttonPanel.id === id) {
          return buttonPanel;
        }
      }
    }

    return null;
  };

  /**
   * Remove an appbar panel using an id
   *
   * @param {string} id the id of the panel to remove
   */
  removeAppbarPanel = (id: string): void => {
    // loop through groups of appbar button panels
    Object.keys(this.buttons).forEach((groupName) => {
      const group = this.buttons[groupName];

      // delete the panel from the group
      delete group[id];

      // trigger an event that a panel has been removed to update the state and re-render
      api.event.emit(EVENT_NAMES.EVENT_APPBAR_PANEL_REMOVE, null, {});
    });
  };
}
