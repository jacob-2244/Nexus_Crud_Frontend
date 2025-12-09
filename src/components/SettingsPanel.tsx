"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toggleSidebarPosition, toggleFooter } from "@/redux/slices/uiSlice";
import { Switch } from "@/components/ui/switch";
import { X, Sidebar, SettingsIcon } from "lucide-react";

interface SettingsPanelProps {
  onClose?: () => void;
}

function SettingsPanel({ onClose }: SettingsPanelProps) {
  const dispatch = useDispatch();
  const sidebarPosition = useSelector((state: RootState) => state.ui.sidebarPosition);
  const showFooter = useSelector((state: RootState) => state.ui.showFooter);

  // We need to handle the switch click directly on the parent div
  const handleSidebarToggle = () => {
    dispatch(toggleSidebarPosition());
  };

  const handleFooterToggle = () => {
    dispatch(toggleFooter());
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-72 absolute right-0 top-full mt-2 z-50">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-semibold flex items-center gap-2 text-black">
          <SettingsIcon className="w-4 h-4 " />
          Settings
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100  rounded transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Settings Options */}
      <div className="space-y-4 mt-4">
        {/* Sidebar Position */}
        <div 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          onClick={handleSidebarToggle}
        >
          <div className="flex items-center gap-3">
            <Sidebar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm  text-black font-medium">{sidebarPosition === "right" ? "Toggle Left" : "Toggle Right"}</p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                {sidebarPosition === "right" ? "Right side" : "Left side"}
              </p> */}
            </div>
          </div>
          <Switch 
            checked={sidebarPosition === "right"}
            onClick={(e) => {
              e.stopPropagation();
              handleSidebarToggle();
            }}
          />
        </div>

        {/* Show Footer */}
        <div 
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          onClick={handleFooterToggle}
        >
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-black">     {showFooter ? "Hide Footer" : "Show Footer"}</p>
              {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                {showFooter ? "Visible" : "Hidden"}
              </p> */}
            </div>
          </div>
          <Switch 
            checked={showFooter}
            onClick={(e) => {
              e.stopPropagation();
              handleFooterToggle();
            }}
          />
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Changes apply instantly
        </p>
      </div>
    </div>
  );
}

export default SettingsPanel;