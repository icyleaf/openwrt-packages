include $(TOPDIR)/rules.mk

PKG_NAME:=fastfetch
PKG_VERSION:=2.52.0
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://codeload.github.com/fastfetch-cli/fastfetch/tar.gz/$(PKG_VERSION)?
PKG_HASH:=6199c4cacc0b411fde7ec6c66d12829459284c6cdfb4bacce7b535190d5cd94c

PKG_LICENSE:=MIT
PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>

PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk
include $(INCLUDE_DIR)/cmake.mk

define Package/fastfetch
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Fetch and display system information
  URL:=https://github.com/fastfetch-cli/fastfetch
  DEPENDS+=
endef

define Package/fastfetch/description
  Fastfetch is a neofetch-like tool for fetching
  system information and displaying it prettily.
endef

define Package/fastfetch/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/fastfetch $(1)/usr/bin/
endef

$(eval $(call BuildPackage,fastfetch))
