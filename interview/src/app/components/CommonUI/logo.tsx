import React from 'react'
import styles from './style/logo.module.css'
import { FaBolt } from "react-icons/fa";

const logo = () => {
  return (
    <div>
        <div className={`${styles.fadeUp1} mb-9 flex items-center gap-2.5`}>
         <div
          className={`${styles.brandIcon} flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] text-lg`}
          >
                <FaBolt size={16} />
         </div>
          <span className={`${styles.brandName} text-[18px] font-bold text-[#f0eaff]`}>
            Prep<span className="text-violet-400">IQ</span>
          </span>
        </div>
    </div>
  )
}

export default logo